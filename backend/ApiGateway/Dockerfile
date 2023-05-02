FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
COPY /ApiGateway/ApiGateway/ApiGateway.csproj /ApiGateway/ApiGateway/ApiGateway.csproj
RUN dotnet restore /ApiGateway/ApiGateway/ApiGateway.csproj

COPY . .
RUN dotnet build /ApiGateway/ApiGateway/ApiGateway.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish /ApiGateway/ApiGateway/ApiGateway.csproj -c Release -o /app

FROM base AS final
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "ApiGateway.dll"]
