using System.Reflection;
using EmailService.Application.Common.Validators;
using EmailService.RazorHtmlEmails.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace EmailService.Application
{
    public static class ConfigureServices
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            services.AddValidatorsFromAssemblyContaining<SendEmailValidator>();
            // services.AddValidatorsFromAssemblyContaining<SendEmailValidatorMultiple>();
            services.AddMediatR(Assembly.GetExecutingAssembly());
            services.AddScoped<IRazorViewToStringRenderer, RazorViewToStringRenderer>();

            return services;
        }
    }
}
