# gRPC Emergency Service

This folder contains documentation and mock data related to the gRPC Emergency Alert Service.

## Contents:

-   **`emergency.proto`**: The Protocol Buffer definition file (`.proto`) for the Emergency Alert Service, defining RPC methods and message structures.
-   **`mock_data.cs`**: A C# snippet showing how the in-memory mock data is seeded within the `EmergencyAlertServiceImpl.cs` service.
-   **`example_request.json`**: An example JSON payload for a gRPC request, likely used for testing or demonstration.

## Service Description:

The gRPC Emergency Service is designed for rapid and reliable communication, handling real-time events such as accidents, fires, or medical emergencies. It uses Protocol Buffers for efficient message serialization and gRPC for high-performance communication.

## Mock Data Details:

The `mock_data.cs` file demonstrates the initial data loaded into the service's in-memory store upon startup. This includes several `Alert` objects with various types, statuses, and geographical information.

## Example Usage:

Refer to `emergency.proto` for the full service definition and message types. The `example_request.json` can be used to understand the structure of a sample request.
