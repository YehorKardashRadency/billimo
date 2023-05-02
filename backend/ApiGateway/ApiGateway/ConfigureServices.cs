
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using Ocelot.DependencyInjection;
using Ocelot.RequestId;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace ApiGateway
{
  public static class ConfigureServices
  {
    public static IServiceCollection AddGatewayServices(this IServiceCollection services, IConfiguration configuration)
    {
      services.AddOcelot(configuration);
      services.ConfigureDownstreamHostAndPortsPlaceholders(configuration);
      var tokenValidationParams = new TokenValidationParameters
      {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = configuration.GetValue<string>("JwtConfig:ValidIssuer"),
        ValidAudience = configuration.GetValue<string>("JwtConfig:ValidAudience"),
        RequireExpirationTime = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetValue<string>("JwtConfig:Secret"))),
        ClockSkew = TimeSpan.Zero,
      };

      var authenticationProviderKey = configuration.GetValue<string>("JwtConfig:IdentityKey");

      services.AddAuthentication(opt =>
      {
        opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        opt.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
      }).AddJwtBearer(authenticationProviderKey, options =>
      {
        options.SaveToken = true;
        options.TokenValidationParameters = tokenValidationParams;
      });
      var clientUrl = configuration.GetValue<string>("ClientUrl");
      Console.WriteLine($"Allowing CORS requests from {clientUrl}");
      services.AddCors(option =>
      {
        option.AddPolicy("dev", builder =>
                  builder
                  .WithOrigins(new string[] {
                    clientUrl
               })
               // .AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials()
                   );
      });

      return services;
    }
  }
}
