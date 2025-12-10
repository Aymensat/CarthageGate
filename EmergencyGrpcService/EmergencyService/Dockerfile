# Stage 1: Build the application
# Use the .NET 10.0 SDK preview image to build the project
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

# Copy the project file and restore dependencies separately to leverage Docker layer caching
COPY *.csproj .
RUN dotnet restore

# Copy the rest of the source code
COPY . .

# Build and publish the application for release
RUN dotnet publish -c Release -o /app/publish --no-restore

# Stage 2: Create the final runtime image
# Use the smaller ASP.NET 10.0 runtime preview image
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS final
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /app/publish .

# Expose the port for unencrypted gRPC traffic.
EXPOSE 5001

# Configure the app to listen on the exposed port.
ENV ASPNETCORE_URLS=http://+:5001

# Set the entrypoint for the container
ENTRYPOINT ["dotnet", "EmergencyService.dll"]
