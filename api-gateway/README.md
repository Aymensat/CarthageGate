# API Gateway - Smart City Platform

This service is the central API Gateway for the Smart City microservices platform. It acts as a single entry point for all client requests and routes them to the appropriate backend service. It also handles protocol translation where necessary (e.g., exposing RESTful endpoints for gRPC and SOAP services).

---

## Features

- **Centralized Routing**: Provides a single, consistent base URL for all microservices.
- **Service Discovery**: Uses Docker service names for routing in a containerized environment.
- **Protocol Translation**:
    - Exposes RESTful JSON endpoints for the **gRPC** `EmergencyAlertService`.
    - Exposes RESTful JSON endpoints for the **SOAP** `AirQuality` service.
- **Simple Proxying**: Forwards HTTP requests to the REST `Mobility` service, the `GraphQL` service, and the `Orchestrator` service.

---

## Endpoint Routing

The gateway maps the following paths to their respective backend services:

| Gateway Path          | Backend Service & Port | Protocol   | Notes                                    |
| --------------------- | ---------------------- | ---------- | ---------------------------------------- |
| `POST /graphql`       | `graphql-service:4000` | GraphQL    | Proxies GraphQL queries.                 |
| `/mobility/*`         | `rest-service:8080`    | REST/HTTP  | Proxies all mobility-related endpoints.  |
| `/air-quality/*`      | `soap-service:8081`    | SOAP       | Translates REST calls to SOAP requests.  |
| `/emergency/*`        | `grpc-service:5001`    | gRPC       | Translates REST calls to gRPC requests.  |
| `/orchestrator/*`     | `orchestrator:3000`    | REST/HTTP  | Proxies requests to the trip planner.    |

---

## Development & Testing

### Prerequisites
- Node.js and npm installed.
- All other microservices running (e.g., via `docker-compose up`).

### Installation
```bash
# Navigate to the gateway directory
cd api-gateway

# Install dependencies
npm install
```

### Running Locally for Debugging
To run the gateway locally for development or debugging against the running Docker stack, use:
```bash
npm run dev
```
This command uses `nodemon` to automatically restart the server on file changes.

### **IMPORTANT NOTE FOR LOCAL TESTING**

To allow the locally-run gateway to connect to the services running inside Docker, the service URLs within the code have been **temporarily changed** to point to `localhost:<port>`.

These changes are marked with a `// TEMPORARY` comment in the following files:
- `index.js` (for REST, GraphQL, and Orchestrator proxies)
- `grpcClient.js` (for the gRPC service address)
- `soapClient.js` (for the SOAP service WSDL URL)

This configuration is for **local debugging only**.

---

## Docker Deployment

To run the entire platform, including the gateway, using Docker, you must first revert the temporary `localhost` changes mentioned above.

1.  **Revert Temporary Changes**: Change all `localhost:<port>` URLs back to their Docker service names (e.g., `rest-service:8080`, `grpc-service:5001`, etc.).
2.  **Build and Run with Docker Compose**: From the project root directory, run:
    ```bash
    docker-compose up --build
    ```
This will build the gateway image and run all services in a shared Docker network, allowing them to communicate via their service names.
