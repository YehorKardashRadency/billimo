namespace ApiGateway;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ocelot.Configuration.File;

public class GlobalHosts : Dictionary<string, Uri> { }

public static class FileConfigurationExtensions
{
    public static IServiceCollection ConfigureDownstreamHostAndPortsPlaceholders(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.PostConfigure<FileConfiguration>(fileConfiguration =>
        {
            var globalHosts = configuration
                .GetSection($"{nameof(FileConfiguration.GlobalConfiguration)}:Hosts")
                .Get<GlobalHosts>();
            if (globalHosts.Count > 0)
            {
                Console.WriteLine("Found host configuration:");
                foreach (var host in globalHosts)
                {
                    Console.WriteLine($"\tVariable:{host.Key} Value:{host.Value}");
                }
            }
            else
            {
                Console.WriteLine("Host configurations not found");
            }
            
            foreach (var route in fileConfiguration.Routes)
            {
                ConfigureRoute(route, globalHosts);
            }
        });

        return services;
    }

    private static void ConfigureRoute(FileRoute route, GlobalHosts globalHosts)
    {
        foreach (var hostAndPort in route.DownstreamHostAndPorts)
        {
            var host = hostAndPort.Host;
            if (host.StartsWith("{") && host.EndsWith("}"))
            {
                var placeHolder = host.TrimStart('{').TrimEnd('}');
                if (globalHosts.TryGetValue(placeHolder, out var uri))
                {
                    route.DownstreamScheme = uri.Scheme;
                    hostAndPort.Host = uri.Host;
                    hostAndPort.Port = uri.Port;
                }
                else throw new InvalidOperationException($"Host configuration for value {placeHolder} was not found");
            }
        }
    }
}
