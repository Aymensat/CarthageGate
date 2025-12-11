# Orchestrator Service

This service acts as the central integration point for the Smart City project. It provides a "Smart Trip Planner" workflow, orchestrating calls to various underlying microservices to provide a consolidated and intelligent trip plan.

This service exposes **one primary API endpoint**.

## Features

-   **Smart Trip Planner**: A single endpoint to plan a trip between two zones.
-   **Service Orchestration**: Communicates with:
    -   SOAP Air Quality Service
    -   REST Mobility Service
    -   gRPC Emergency Service
-   **Consolidated Response**: Aggregates data on transport, air quality, and safety alerts into a single, user-friendly JSON response.

---

## API Documentation

### Plan a Trip

-   **Endpoint**: `POST /api/plan-trip`
-   **Description**: Creates a trip plan by fetching and combining data from all relevant services.
-   **Request Body**:
    ```json
    {
      "startZone": "Zone Name",
      "destinationZone": "Zone Name"
    }
    ```

---

## Usage Examples

### Example 1: Successful Trip with Direct Transport

This example shows a query that will find a direct transport option in the mock data.

-   **Request**:
    ```json
    {
      "startZone": "Tunis Center",
      "destinationZone": "Charguia"
    }
    ```

-   **Expected Successful Response (excerpt)**:
    ```json
    {
        "startZone": "Tunis Center",
        "destinationZone": "Charguia",
        "airQuality": { /* ... Air quality for Tunis Center ... */ },
        "transportOptions": [
            {
                "id": 3,
                "stationFrom": "Barcelona",
                "stationTo": "Charguia",
                "departureTime": "06:20:00",
                "arrivalTime": "06:30:00",
                "transportLine": { /* ... Metro Line M1 details ... */ }
            }
        ],
        "emergencyAlerts": [ /* ... Any alerts in Tunis Center or Charguia ... */ ],
        "warnings": [],
        "errors": [],
        "message": "Trip plan generated successfully."
    }
    ```

### Example 2: Trip with No Direct Transport

This example shows how the service responds when there is no direct route between zones, which is a known limitation of the current version.

-   **Request**:
    ```json
    {
      "startZone": "Tunis Center",
      "destinationZone": "Sidi Bou Said"
    }
    ```
-   **Expected Response with Warning**:
    ```json
    {
        "startZone": "Tunis Center",
        "destinationZone": "Sidi Bou Said",
        "airQuality": { /* ... */ },
        "transportOptions": [],
        "emergencyAlerts": [ /* ... */ ],
        "warnings": [
            "No direct transport options found from Tunis Center to Sidi Bou Said."
        ],
        "errors": [],
        "message": "Trip plan generated with warnings."
    }
    ```

---

## Configuration

This service is configured via environment variables. Create a `.env` file in the root of the `orchestrator-service` directory (you can copy `.env.example`).

| Variable                      | Description                               | Default     |
| ----------------------------- | ----------------------------------------- | ----------- |
| `AIR_QUALITY_SERVICE_HOST`    | Hostname for the SOAP Air Quality service | `localhost` |
| `AIR_QUALITY_SERVICE_PORT`    | Port for the SOAP Air Quality service     | `8081`      |
| `MOBILITY_SERVICE_HOST`       | Hostname for the REST Mobility service    | `localhost` |
| `MOBILITY_SERVICE_PORT`       | Port for the REST Mobility service        | `8080`      |
| `EMERGENCY_SERVICE_HOST`      | Hostname for the gRPC Emergency service   | `localhost` |
| `EMERGENCY_SERVICE_PORT`      | Port for the gRPC Emergency service       | `5001`      |

---

## How to Run

### Prerequisites
- Node.js and npm installed.
- The other smart city microservices (SOAP, REST, gRPC) must be running and accessible on the ports defined in your `.env` file.

### 1. Install Dependencies
Navigate to the `orchestrator-service` directory and run:
```bash
npm install
```

### 2. Run the Server
To start the orchestrator service, run the following command from the `orchestrator-service` directory:
```bash
node index.js
```
The service will then be running and available at `http://localhost:3000`.

---

## Docker

### Build the Image
```bash
docker build -t orchestrator-service .
```

### Run the Container
Running with Docker is typically done via `docker-compose` to link all services. To run standalone, you must configure the environment variables and network to allow the orchestrator container to reach the other service containers.
```bash
# Example for Docker Desktop on Windows/macOS
docker run -p 3000:3000 \
  -e AIR_QUALITY_SERVICE_HOST=host.docker.internal \
  -e MOBILITY_SERVICE_HOST=host.docker.internal \
  -e EMERGENCY_SERVICE_HOST=host.docker.internal \
  --name orchestrator orchestrator-service
```