FROM mcr.microsoft.com/dotnet/sdk:6.0 AS base
WORKDIR /app

RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
COPY /Administration/src/Administration/Administration.csproj /Administration/src/Administration/Administration.csproj
COPY /Administration/src/Administration.Application/Administration.Application.csproj /Administration/src/Administration.Application/Administration.Application.csproj
COPY /Administration/src/Administration.Domain/Administration.Domain.csproj /Administration/src/Administration.Domain/Administration.Domain.csproj
COPY /Administration/src/Administration.Infrastructure/Administration.Infrastructure.csproj /Administration/src/Administration.Infrastructure/Administration.Infrastructure.csproj
COPY /BuildingBlocks/EventBus.Messages/EventBus.Messages.csproj /BuildingBlocks/EventBus.Messages/EventBus.Messages.csproj
RUN dotnet restore /Administration/src/Administration/Administration.csproj

COPY . .
RUN dotnet build /Administration/src/Administration/Administration.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish /Administration/src/Administration/Administration.csproj -c Release -o /app

FROM base AS final
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Administration.dll"]
