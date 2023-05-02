using EventBus.Messages.Common;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Application.Consumers;
using Invoicing.Infrastructure.Persistence;
using Invoicing.Infrastructure.Services;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RestEase.HttpClientFactory;

namespace Invoicing.Infrastructure;

public static class ConfigureServices
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        if (configuration.GetValue<bool>("UseInMemoryDatabase"))
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase("InvoicingDb"));
        }
        else
        {
            var b = configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"),
                    builder => builder.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));
        }

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
        services.AddScoped<IRegularInvoiceService, RegularInvoiceService>();
        services.AddScoped<ApplicationDbContextInitialiser>();
        services.AddTransient<IDateTime, DateTimeService>();
        services.AddMassTransit(config =>
        {
            config.AddConsumer<UpdateBuyerInvoicesConsumer>();
            config.AddConsumer<UpdateCompanyInfoConsumer>();
            config.UsingRabbitMq((ctx, cfg) =>
            {
                cfg.Host(configuration["EventBusSettings:HostAddress"]);
                cfg.ReceiveEndpoint(EventBusConstants.UpdateBuyerInvoicesQueue, c => {
                    c.ConfigureConsumer<UpdateBuyerInvoicesConsumer>(ctx);
                });
                cfg.ReceiveEndpoint(EventBusConstants.UpdateCompanyInfoQueue, c => {
                    c.ConfigureConsumer<UpdateCompanyInfoConsumer>(ctx);
                });
            });
        });
        services
            .AddRestEaseClient<IAdministrationApi>(configuration["AdministrationApi"])
            .ConfigurePrimaryHttpMessageHandler(_ => new HttpClientHandler()
            {
                ClientCertificateOptions = ClientCertificateOption.Manual,
                ServerCertificateCustomValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true
            });
        services.AddScoped<IBillsExternalData, BillsExternalData>();

        return services;
    }
}

