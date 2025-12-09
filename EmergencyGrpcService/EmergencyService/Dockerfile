# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY EmergencyGrpcService/EmergencyService/EmergencyService.csproj EmergencyGrpcService/EmergencyService/
COPY EmergencyGrpcService/EmergencyService/Protos/ EmergencyGrpcService/EmergencyService/Protos/
RUN dotnet restore EmergencyGrpcService/EmergencyService/EmergencyService.csproj

# Copy the rest of the source code and build
COPY EmergencyGrpcService/EmergencyService/ EmergencyGrpcService/EmergencyService/
WORKDIR /src/EmergencyGrpcService/EmergencyService
RUN dotnet publish -c Release -o /app/publish --no-restore

# Stage 2: Create the final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /app/publish .

# Expose the gRPC port
EXPOSE 5001

# Set the URL for the ASP.NET Core application to listen on
ENV ASPNETCORE_URLS=http://+:5001

# Run the application
ENTRYPOINT ["dotnet", "EmergencyService.dll"]
