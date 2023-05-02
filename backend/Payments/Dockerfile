FROM mcr.microsoft.com/dotnet/sdk:6.0 AS base
WORKDIR /app

RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
COPY /Payments/src/Payments/Payments.csproj /Payments/src/Payments/Payments.csproj
COPY /Payments/src/Payments.Application/Payments.Application.csproj /Payments/src/Payments.Application/Payments.Application.csproj
COPY /Payments/src/Payments.Domain/Payments.Domain.csproj /Payments/src/Payments.Domain/Payments.Domain.csproj
COPY /Payments/src/Payments.Infrastructure/Payments.Infrastructure.csproj /Payments/src/Payments.Infrastructure/Payments.Infrastructure.csproj
RUN dotnet restore /Payments/src/Payments/Payments.csproj

COPY . .
RUN dotnet build /Payments/src/Payments/Payments.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish /Payments/src/Payments/Payments.csproj -c Release -o /app

FROM base AS final
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Payments.dll"]
