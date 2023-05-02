using Invoicing.Application.Common.Interfaces;
using Invoicing.Infrastructure.Persistence;
using Invoicing.Services;
using FluentValidation.AspNetCore;
using Microsoft.OpenApi.Models;
using Invoicing.Infrastructure.Services;
using Newtonsoft.Json.Converters;

public static class ConfigureServices
{
    public static IServiceCollection AddApiServices(this IServiceCollection services)
    {
        services.AddDatabaseDeveloperPageExceptionFilter();

        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        services.AddHealthChecks()
            .AddDbContextCheck<ApplicationDbContext>();

        services.AddControllers(opts => 
            opts.Filters.Add<ApiExceptionFilterAttribute>())
                .AddFluentValidation(x => x.AutomaticValidationEnabled = false)
            .AddNewtonsoftJson(opts => opts.SerializerSettings
                .Converters.Add(new StringEnumConverter()));

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        return services;
    }
}
