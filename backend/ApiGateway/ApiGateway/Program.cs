using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using ApiGateway.Middlewares;

namespace ApiGateway
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            await new WebHostBuilder()
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .ConfigureAppConfiguration((hostingContext, config) =>
                {
                    config
                        .AddEnvironmentVariables()
                        .SetBasePath(hostingContext.HostingEnvironment.ContentRootPath)
                        .AddJsonFile("appsettings.json", true, true)
                        .AddJsonFile($"appsettings.{hostingContext.HostingEnvironment.EnvironmentName}.json", true,
                            true)
                        .AddOcelot("Configurations/", hostingContext.HostingEnvironment);

                })
                .ConfigureLogging((logger) =>
                {
                    logger.AddConsole();
                })
                .ConfigureServices((context,s) => {
                    s.AddGatewayServices(context.Configuration);
                })
                .Configure(app =>
                {
                    
                    var gatewayConfiguration = new OcelotPipelineConfiguration
                    {
                        AuthorizationMiddleware = async (httpContext, next) =>
                        {
                            await OcelotAuthorizationMiddleware.Authorize(httpContext, next);
                        }
                    };
                    app.UseCors("dev");
                    app.UseAuthentication();
                    app.UseOcelot(gatewayConfiguration).Wait();
                })
                .Build()
                .RunAsync();
            
            

        }
    }
}
