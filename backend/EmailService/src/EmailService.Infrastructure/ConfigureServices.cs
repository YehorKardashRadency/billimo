using EmailService.Application.Common.Interfaces;
using EmailService.Application.Consumers;
using EmailService.Infrastructure.Services;
using EventBus.Messages.Common;
using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EmailService.Infrastructure
{
    public static class ConfigureServices
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddTransient<IEmailSender, EmailSender>();

            services.AddMassTransit(config =>
            {
                config.AddConsumer<UserRegistrationConsumer>();
                config.AddConsumer<BillEmailConsumer>();
                config.AddConsumer<SendTwoFactorAuthCodeConsumer>();
                config.AddConsumer<EmailNotificationConsumer>();

                config.UsingRabbitMq((ctx, cfg) =>
                {
                    cfg.Host(configuration["EventBusSettings:HostAddress"]);
                    cfg.ReceiveEndpoint(EventBusConstants.UserRegistrationQueue, c =>
                    {
                        c.ConfigureConsumer<UserRegistrationConsumer>(ctx);
                    });
                    cfg.ReceiveEndpoint(EventBusConstants.BillEmailQueue, c => {
                        c.ConfigureConsumer<BillEmailConsumer>(ctx);
                    });
                    cfg.ReceiveEndpoint(EventBusConstants.NotificationQueue, c => {
                        c.ConfigureConsumer<EmailNotificationConsumer>(ctx);
                    });
                    cfg.ReceiveEndpoint(EventBusConstants.SendTwoFactorAuthCodeQueue, c =>
                    {
                        c.ConfigureConsumer<SendTwoFactorAuthCodeConsumer>(ctx);
                    });
                });
            });

            return services;
        }
    }
}
