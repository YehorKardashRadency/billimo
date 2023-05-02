using System.Reflection;
using Invoicing.Application.Common.Behaviours;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Invoicing.Application.Common.Interfaces;
using RestEase.HttpClientFactory;
using Microsoft.Extensions.Configuration;
using Quartz.Impl;
using Quartz;
using Invoicing.Application.Common.Jobs;
using Invoicing.Application.Common.JobFactory;

namespace Invoicing.Application;

public static class ConfigureServices
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddMediatR(Assembly.GetExecutingAssembly());
        // services.AddTransient(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehaviour<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehaviour<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
        services.AddRestEaseClient<IPaymentApi>(configuration["GatewayApi"]);
        services.AddScoped(provider =>
        {
            using var scope = provider.CreateScope();
            var service = scope.ServiceProvider.GetRequiredService<IRegularInvoiceService>();
            return new RegularInvoiceJob(service);
        });
        services.AddQuartz(q =>
        {
            q.UseMicrosoftDependencyInjectionJobFactory();
        });

        services.AddQuartzHostedService(q =>
        {
            q.WaitForJobsToComplete = true;
        });

        services.AddSingleton(provider =>
        {
            var schedulerFactory = new StdSchedulerFactory();

            var jobFactory = new JobFactory(provider); 
            var scheduler = schedulerFactory.GetScheduler().GetAwaiter().GetResult();
            scheduler.JobFactory = jobFactory;
            return scheduler;
        });

        return services;
    }
}