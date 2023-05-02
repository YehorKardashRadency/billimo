using EventBus.Messages.Common;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Payments.Application.Common.Interfaces;
using Payments.Application.Consumers;
using Payments.Infrastructure.Persistence;
using Payments.Infrastructure.Services;
using Quartz;

namespace Payments.Infrastructure
{
    public static class ConfigureServices
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            if (configuration.GetValue<bool>("UseInMemoryDatabase"))
            {
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseInMemoryDatabase("PaymentsDb"));
            }
            else
            {
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"),
                        builder => builder.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));
            }

            services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
            services.AddScoped<ApplicationDbContextInitialiser>();
            services.AddTransient<IDateTime, DateTimeService>();

            services.AddQuartz(q =>
            {
                q.UseMicrosoftDependencyInjectionJobFactory();

                var postponedJobKey = new JobKey("PostponedPayments");
                q.AddJob<PostponedPaymentJob>(opts => opts.WithIdentity(postponedJobKey));

                q.AddTrigger(opts => opts
                    .ForJob(postponedJobKey)
                    .WithIdentity("PostponedPayments-trigger")
                    .WithCronSchedule("0 */2 * ? * *"));
            });

            services.AddQuartzHostedService(
                q => q.WaitForJobsToComplete = true);

            services.AddMassTransit(config =>
            {
                config.AddConsumer<UpdatePaymentStatisticConsumer>();
                config.AddConsumer<CreatePaymentStatisticConsumer>();
                config.AddConsumer<UpdateBuyerStatisticConsumer>();
                config.UsingRabbitMq((ctx, cfg) =>
                {
                    cfg.Host(configuration["EventBusSettings:HostAddress"]);
                    cfg.ReceiveEndpoint(EventBusConstants.UpdatePaymentStatisticQueue, c => {
                        c.ConfigureConsumer<UpdatePaymentStatisticConsumer>(ctx);
                    });
                    cfg.ReceiveEndpoint(EventBusConstants.CreatePaymentStatisticQueue, c => {
                        c.ConfigureConsumer<CreatePaymentStatisticConsumer>(ctx);
                    });
                    cfg.ReceiveEndpoint(EventBusConstants.UpdateBuyerInvoicesQueue, c => {
                        c.ConfigureConsumer<UpdateBuyerStatisticConsumer>(ctx);
                    });
                });
            });

            return services;
        }
    }
}