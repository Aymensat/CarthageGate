The command to run the docker image is:
```
docker run -d -p 5001:5001 -e "ASPNETCORE_ENVIRONMENT=Development" --name emergency-grpc-service emergency-service
```

And the available gRPC endpoints are:
- `emergency.EmergencyAlertService.CreateAlert`
- `emergency.EmergencyAlertService.GetAlert`
- `emergency.EmergencyAlertService.GetAlertsByZone`
- `emergency.EmergencyAlertService.UpdateAlertStatus`
- `emergency.EmergencyAlertService.StreamAlerts` (This is a server-streaming endpoint)

You can use them with `grpcurl`. For example, to call `GetAlertsByZone`:
```
grpcurl -plaintext -d '{"zone": "Central"}' localhost:5001 emergency.EmergencyAlertService.GetAlertsByZone
```
