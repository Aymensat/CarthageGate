using Grpc.Core;
using Google.Protobuf.WellKnownTypes;
using System.Collections.Concurrent;

namespace EmergencyService.Services;

public class EmergencyAlertServiceImpl : EmergencyAlertService.EmergencyAlertServiceBase
{
    private readonly ILogger<EmergencyAlertServiceImpl> _logger;
    
    // In-memory storage (like your H2 in Spring Boot)
    private static readonly ConcurrentDictionary<string, Alert> _alerts = new();
    
    // For streaming: subscribers waiting for new alerts
    private static readonly List<IServerStreamWriter<Alert>> _subscribers = new();
    private static readonly object _lock = new();

    // Tunisian zones (matching your SOAP/REST services)
    private static readonly HashSet<string> ValidZones = new(StringComparer.OrdinalIgnoreCase)
    {
        "Tunis Marine", "République", "Barcelona", "Charguia",
        "Tunis Center", "Bab Bhar", "Jardin Thameur", "La Goulette",
        "Sidi Bou Said", "La Marsa", "Ariana Center", "Tunis Carthage Airport"
    };

    public EmergencyAlertServiceImpl(ILogger<EmergencyAlertServiceImpl> logger)
    {
        _logger = logger;
        SeedData(); // Add some initial alerts
    }

    private void SeedData()
    {
        if (_alerts.IsEmpty)
        {
            var alert1 = new Alert
            {
                Id = Guid.NewGuid().ToString(),
                Type = AlertType.Medical,
                Zone = "Tunis Marine",
                Description = "Person collapsed near the station",
                Status = AlertStatus.Pending,
                Latitude = 36.8002,
                Longitude = 10.1857,
                CreatedAt = Timestamp.FromDateTime(DateTime.UtcNow.AddMinutes(-30)),
                UpdatedAt = Timestamp.FromDateTime(DateTime.UtcNow.AddMinutes(-30)),
                ReporterPhone = "+216 20 123 456"
            };

            var alert2 = new Alert
            {
                Id = Guid.NewGuid().ToString(),
                Type = AlertType.Fire,
                Zone = "Charguia",
                Description = "Small fire in industrial area",
                Status = AlertStatus.InProgress,
                Latitude = 36.8356,
                Longitude = 10.1228,
                CreatedAt = Timestamp.FromDateTime(DateTime.UtcNow.AddHours(-1)),
                UpdatedAt = Timestamp.FromDateTime(DateTime.UtcNow.AddMinutes(-15)),
                ReporterPhone = "+216 55 987 654"
            };

            var alert3 = new Alert
            {
                Id = Guid.NewGuid().ToString(),
                Type = AlertType.Accident,
                Zone = "La Marsa",
                Description = "Car accident on main road",
                Status = AlertStatus.Resolved,
                Latitude = 36.8783,
                Longitude = 10.3247,
                CreatedAt = Timestamp.FromDateTime(DateTime.UtcNow.AddHours(-3)),
                UpdatedAt = Timestamp.FromDateTime(DateTime.UtcNow.AddHours(-2)),
                ReporterPhone = "+216 99 111 222"
            };

            _alerts.TryAdd(alert1.Id, alert1);
            _alerts.TryAdd(alert2.Id, alert2);
            _alerts.TryAdd(alert3.Id, alert3);
        }
    }

    // ============== CREATE ALERT ==============
    public override async Task<CreateAlertResponse> CreateAlert(
        CreateAlertRequest request, ServerCallContext context)
    {
        _logger.LogInformation("Creating alert in zone: {Zone}", request.Zone);

        // Validation
        if (string.IsNullOrWhiteSpace(request.Zone))
        {
            throw new RpcException(new Status(StatusCode.InvalidArgument, "Zone is required"));
        }

        if (!ValidZones.Contains(request.Zone))
        {
            throw new RpcException(new Status(StatusCode.InvalidArgument, 
                $"Invalid zone. Valid zones: {string.Join(", ", ValidZones)}"));
        }

        if (string.IsNullOrWhiteSpace(request.Description))
        {
            throw new RpcException(new Status(StatusCode.InvalidArgument, "Description is required"));
        }

        var alert = new Alert
        {
            Id = Guid.NewGuid().ToString(),
            Type = request.Type,
            Zone = request.Zone,
            Description = request.Description,
            Status = AlertStatus.Pending,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            CreatedAt = Timestamp.FromDateTime(DateTime.UtcNow),
            UpdatedAt = Timestamp.FromDateTime(DateTime.UtcNow),
            ReporterPhone = request.ReporterPhone
        };

        _alerts.TryAdd(alert.Id, alert);

        // Notify all streaming subscribers
        await NotifySubscribers(alert);

        _logger.LogInformation("Alert created with ID: {Id}", alert.Id);

        return new CreateAlertResponse
        {
            Alert = alert,
            Message = "Alert created successfully. Emergency services notified."
        };
    }

    // ============== GET ALERT BY ID ==============
    public override Task<GetAlertResponse> GetAlert(
        GetAlertRequest request, ServerCallContext context)
    {
        _logger.LogInformation("Fetching alert: {Id}", request.Id);

        if (!_alerts.TryGetValue(request.Id, out var alert))
        {
            throw new RpcException(new Status(StatusCode.NotFound, 
                $"Alert with ID '{request.Id}' not found"));
        }

        return Task.FromResult(new GetAlertResponse { Alert = alert });
    }

    // ============== GET ALERTS BY ZONE ==============
    public override Task<GetAlertsByZoneResponse> GetAlertsByZone(
        GetAlertsByZoneRequest request, ServerCallContext context)
    {
        _logger.LogInformation("Fetching alerts for zone: {Zone}", request.Zone);

        var query = _alerts.Values.AsEnumerable();

        // Filter by zone if specified
        if (!string.IsNullOrWhiteSpace(request.Zone))
        {
            query = query.Where(a => a.Zone.Equals(request.Zone, StringComparison.OrdinalIgnoreCase));
        }

        // Filter by status if specified
        if (request.StatusFilter != AlertStatus.Unspecified)
        {
            query = query.Where(a => a.Status == request.StatusFilter);
        }

        var alerts = query.OrderByDescending(a => a.CreatedAt).ToList();

        var response = new GetAlertsByZoneResponse { TotalCount = alerts.Count };
        response.Alerts.AddRange(alerts);

        return Task.FromResult(response);
    }

    // ============== UPDATE ALERT STATUS ==============
    public override async Task<UpdateAlertStatusResponse> UpdateAlertStatus(
        UpdateAlertStatusRequest request, ServerCallContext context)
    {
        _logger.LogInformation("Updating alert {Id} to status {Status}", 
            request.Id, request.NewStatus);

        if (!_alerts.TryGetValue(request.Id, out var alert))
        {
            throw new RpcException(new Status(StatusCode.NotFound, 
                $"Alert with ID '{request.Id}' not found"));
        }

        if (request.NewStatus == AlertStatus.Unspecified)
        {
            throw new RpcException(new Status(StatusCode.InvalidArgument, 
                "New status is required"));
        }

        // Update the alert
        alert.Status = request.NewStatus;
        alert.UpdatedAt = Timestamp.FromDateTime(DateTime.UtcNow);
        
        _alerts[request.Id] = alert;

        // Notify subscribers about the update
        await NotifySubscribers(alert);

        return new UpdateAlertStatusResponse
        {
            Alert = alert,
            Message = $"Alert status updated to {request.NewStatus}"
        };
    }

    // ============== STREAM ALERTS (Server Streaming) ==============
    public override async Task StreamAlerts(
        StreamAlertsRequest request, 
        IServerStreamWriter<Alert> responseStream, 
        ServerCallContext context)
    {
        _logger.LogInformation("Client subscribed to alert stream. Zone filter: {Zone}", 
            string.IsNullOrEmpty(request.Zone) ? "ALL" : request.Zone);

        // Add this client to subscribers
        lock (_lock)
        {
            _subscribers.Add(responseStream);
        }

        try
        {
            // Keep the stream open until client disconnects
            while (!context.CancellationToken.IsCancellationRequested)
            {
                await Task.Delay(1000, context.CancellationToken);
            }
        }
        catch (OperationCanceledException)
        {
            _logger.LogInformation("Client disconnected from alert stream");
        }
        finally
        {
            lock (_lock)
            {
                _subscribers.Remove(responseStream);
            }
        }
    }

    // Helper: Notify all streaming subscribers
    private async Task NotifySubscribers(Alert alert)
    {
        List<IServerStreamWriter<Alert>> currentSubscribers;
        lock (_lock)
        {
            currentSubscribers = _subscribers.ToList();
        }

        foreach (var subscriber in currentSubscribers)
        {
            try
            {
                await subscriber.WriteAsync(alert);
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Failed to notify subscriber: {Error}", ex.Message);
            }
        }
    }
}