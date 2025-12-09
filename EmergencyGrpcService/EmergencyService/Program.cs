using EmergencyService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add gRPC services
builder.Services.AddGrpc();

// Add gRPC reflection (for testing tools like grpcurl)
builder.Services.AddGrpcReflection();

var app = builder.Build();

// Map gRPC service
app.MapGrpcService<EmergencyAlertServiceImpl>();

// Enable reflection in development
if (app.Environment.IsDevelopment())
{
    app.MapGrpcReflectionService();
}

app.MapGet("/", () => "Emergency gRPC Service is running. Use a gRPC client to communicate.");

Console.WriteLine("========================================");
Console.WriteLine("  Emergency gRPC Service Started");
Console.WriteLine("  Listening on: https://localhost:7001");
Console.WriteLine("                http://localhost:5001");
Console.WriteLine("========================================");

app.Run();
