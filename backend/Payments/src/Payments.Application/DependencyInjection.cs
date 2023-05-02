using System.Reflection;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Payments.Application.Common.Interfaces;
using Payments.Application.Transactions;
using RestEase.HttpClientFactory;
using Microsoft.Extensions.Configuration;
using Payments.Application.AdministrationApi;

namespace Payments.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<Profile, Mapping>();
        services.AddScoped(provider =>
        {
            var mapperConfiguration = new MapperConfiguration(cfg =>
            {
                cfg.AddProfiles(provider.CreateScope().ServiceProvider.GetService<IEnumerable<Profile>>());
                cfg.AddMaps(Assembly.GetExecutingAssembly());
            });

            return mapperConfiguration.CreateMapper();
        });

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddMediatR(Assembly.GetExecutingAssembly());
        services.AddRestEaseClient<IInvoiceApi>(configuration["InvoiceAPI"])
            .ConfigurePrimaryHttpMessageHandler(_ => new HttpClientHandler()
            {
                ClientCertificateOptions = ClientCertificateOption.Manual,
                ServerCertificateCustomValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true
            });;
        services.AddRestEaseClient<IAdministrationApi>(configuration["AdministrationAPI"])
            .ConfigurePrimaryHttpMessageHandler(_ => new HttpClientHandler()
            {
                ClientCertificateOptions = ClientCertificateOption.Manual,
                ServerCertificateCustomValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true
            });;

        return services;
    }
}