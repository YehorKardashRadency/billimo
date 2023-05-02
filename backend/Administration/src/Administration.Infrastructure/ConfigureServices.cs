using System.Text;
using Administration.Application.Common.Interfaces;
using Administration.Infrastructure.Persistence;
using Administration.Infrastructure.Plaid;
using Administration.Infrastructure.Services;
using Going.Plaid;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Administration.Application.Consumers;
using EventBus.Messages.Common;

namespace Administration.Infrastructure
{
    public static class ConfigureServices
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            if (configuration.GetValue<bool>("UseInMemoryDatabase"))
            {
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseInMemoryDatabase("AdministrationDb"));
            }
            else
            {
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"),
                        builder => builder.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));
            }

            var tokenValidationParams = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration.GetValue<string>("JwtConfig:ValidIssuer"),
                ValidAudience = configuration.GetValue<string>("JwtConfig:ValidAudience"),
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetValue<string>("JwtConfig:Secret"))),
            };

            services.AddSingleton(tokenValidationParams);

            services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
            services.AddScoped<ApplicationDbContextInitialiser>();
            services.AddTransient<IDateTime, DateTimeService>();
            services.AddTransient<IEmailNotificationsSender, EmailNotificationsSender>();
            services.AddMassTransit(config =>
            {
                config.AddConsumer<BillNotificationConsumer>();
                config.UsingRabbitMq((ctx, cfg) =>
                {
                    cfg.Host(configuration["EventBusSettings:HostAddress"]);
                    cfg.ReceiveEndpoint(EventBusConstants.BillNotificationQueue, c => {
                        c.ConfigureConsumer<BillNotificationConsumer>(ctx);
                    });
                });
            });

            services.AddSingleton<PlaidClient>();
            services.Configure<PlaidCredentials>(configuration.GetSection("Plaid"));
            services.Configure<TwoFactorSettings>(configuration.GetSection("TwoFactorSettings"));
            services.Configure<PlaidOptions>(configuration.GetSection("Plaid"));

            services.AddScoped<ITwoFactorAuthService, TwoFactorAuthService>();

            return services;
        }
    }
}
