using Administration.Application.Common.Interfaces;
using Administration.Infrastructure.Persistence;
using Administration.Services;
using FluentValidation.AspNetCore;
using Microsoft.OpenApi.Models;
using Administration.Infrastructure.Services;

namespace Administration
{
    public static class ConfigureServices
    {
        public static IServiceCollection AddApiServices(this IServiceCollection services)
        {
            services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddSingleton<ICurrentUserService, CurrentUserService>();

            services.AddHttpContextAccessor();

            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped(typeof(IAuthService), typeof(AuthService));
            services.AddScoped<ITwoFactorAuthService, TwoFactorAuthService>();
            services.AddScoped<IThumbnailService, ThumbnailService>();

            services.AddHealthChecks()
                .AddDbContextCheck<ApplicationDbContext>();

            services.AddControllers(opts => 
                opts.Filters.Add<ApiExceptionFilterAttribute>())
                    .AddFluentValidation(x => x.AutomaticValidationEnabled = false);

            services.AddEndpointsApiExplorer();           
            services.AddSwaggerGen();

            return services;
        }
    }
}
