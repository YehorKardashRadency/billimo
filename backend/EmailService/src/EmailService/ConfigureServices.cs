using System.Net.Http.Headers;
using EmailService.Infrastructure.Settings;
using FluentValidation.AspNetCore;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace EmailService
{
    public static class ConfigureServices
    {
        public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddControllers()
                .AddFluentValidation(config => config.AutomaticValidationEnabled = false);
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddOptions<SendEmailOptions>().Bind(configuration.GetSection("SendEmailOptions"));
            services.AddRazorPages();

            return services;
        }
    }
}
