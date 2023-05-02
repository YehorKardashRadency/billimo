FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app=

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
COPY /EmailService/src/EmailService/EmailService.csproj /EmailService/src/EmailService/EmailService.csproj
COPY /EmailService/src/EmailService.Application/EmailService.Application.csproj /EmailService/src/EmailService.Application/EmailService.Application.csproj
COPY /EmailService/src/EmailService.RazorHtmlEmails/EmailService.RazorHtmlEmails.csproj /EmailService/src/EmailService.RazorHtmlEmails/EmailService.RazorHtmlEmails.csproj
COPY /EmailService/src/EmailService.Infrastructure/EmailService.Infrastructure.csproj /EmailService/src/EmailService.Infrastructure/EmailService.Infrastructure.csproj
RUN dotnet restore /EmailService/src/EmailService/EmailService.csproj

COPY . .
RUN dotnet build /EmailService/src/EmailService/EmailService.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish /EmailService/src/EmailService/EmailService.csproj -c Release -o /app

FROM base AS final
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "EmailService.dll"]
