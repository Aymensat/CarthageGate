// This file contains the C# code used to seed the in-memory database
// for the Emergency GRPC Service.

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
