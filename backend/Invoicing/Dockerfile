FROM mcr.microsoft.com/dotnet/sdk:6.0 AS base
WORKDIR /app

RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
COPY /Invoicing/src/Invoicing/Invoicing.csproj /Invoicing/src/Invoicing/Invoicing.csproj
COPY /Invoicing/src/Invoicing.Application/Invoicing.Application.csproj /Invoicing/src/Invoicing.Application/Invoicing.Application.csproj
COPY /Invoicing/src/Invoicing.Domain/Invoicing.Domain.csproj /Invoicing/src/Invoicing.Domain/Invoicing.Domain.csproj
COPY /Invoicing/src/Invoicing.Infrastructure/Invoicing.Infrastructure.csproj /Invoicing/src/Invoicing.Infrastructure/Invoicing.Infrastructure.csproj
RUN dotnet restore /Invoicing/src/Invoicing/Invoicing.csproj

COPY . .
RUN dotnet build /Invoicing/src/Invoicing/Invoicing.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish /Invoicing/src/Invoicing/Invoicing.csproj -c Release -o /app

FROM base AS final
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Invoicing.dll"]
