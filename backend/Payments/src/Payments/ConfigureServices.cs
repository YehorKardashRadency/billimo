using Going.Plaid;
using Payments.Application.Common.Interfaces;
using Payments.Application.Common.Models;
using Payments.Infrastructure.Persistence;
using Payments.Services;

namespace Payments;
public static class ConfigureServices
{
    public static IServiceCollection AddApiServices(this IServiceCollection services,IConfiguration configuration)
    {
        services.AddDatabaseDeveloperPageExceptionFilter();
        services.AddSingleton<ICurrentUserService, CurrentUserService>();

        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        
        services.AddScoped<IPlaidService, PlaidService>();
        services.Configure<PlaidConfigModel>(configuration.GetSection(PlaidConfigModel.Key));
        services.AddSingleton<PlaidClient>();

        services.AddHealthChecks()
            .AddDbContextCheck<ApplicationDbContext>();
        
        services.AddControllers();

        services.AddSwaggerGen();

        return services;
    }
}