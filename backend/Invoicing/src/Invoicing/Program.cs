using Invoicing.Application;
using Invoicing.Infrastructure;
using Invoicing.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddApiServices();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}


// Initialise and seed database
using (var scope = app.Services.CreateScope())
{
    var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();
    await initialiser.InitialiseAsync();
    /*if (app.Environment.IsDevelopment()) */
    await initialiser.SeedAsync();
}

app.UseHealthChecks("/health");
app.UseHttpsRedirection();

app.UseCors(builder => builder.AllowAnyOrigin()
                    .WithOrigins(new string[] { "http://localhost:4200", "https://localhost:4200" })
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials());

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
