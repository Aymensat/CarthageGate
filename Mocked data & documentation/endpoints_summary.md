# Microservices Endpoints Summary

This document provides a consolidated summary of all endpoints and example requests for each microservice in the Smart City platform. It aims to offer a quick reference for understanding the functionalities exposed by each service.

---

## 1. REST Smart Mobility Service

**Protocol:** REST
**Base URL:** `http://localhost:8080` (as per `openapi.json`)

### Endpoints:

-   **`GET /api/lines`**: Get all transport lines.
-   **`GET /api/lines/{id}`**: Get a transport line by ID.
-   **`GET /api/lines/type/{type}`**: Get transport lines by type (BUS, METRO, TRAIN, TRAM).
-   **`POST /api/lines`**: Create a new transport line.
    -   **Example Request Body:**
        ```json
        {
          "name": "New Line",
          "lineType": "BUS",
          "lineStatus": "ACTIVE",
          "description": "Description of the new line"
        }
        ```
-   **`PUT /api/lines/{id}`**: Update an existing transport line.
    -   **Example Request Body:**
        ```json
        {
          "id": 1,
          "name": "Updated Metro Line M1",
          "lineType": "METRO",
          "lineStatus": "DELAYED",
          "description": "Metro line M1 with updated status"
        }
        ```
-   **`DELETE /api/lines/{id}`**: Delete a transport line.
-   **`GET /api/schedules`**: Get all schedules.
-   **`GET /api/schedules/{id}`**: Get a schedule by ID.
-   **`GET /api/schedules/line/{lineId}`**: Get schedules for a specific transport line.
-   **`POST /api/schedules`**: Create a new schedule.
    -   **Example Request Body:**
        ```json
        {
          "lineId": 1,
          "stationFrom": "Station A",
          "stationTo": "Station B",
          "departureTime": "07:00:00",
          "arrivalTime": "07:15:00"
        }
        ```
-   **`DELETE /api/schedules/{id}`**: Delete a schedule.

---

## 2. SOAP Air Quality Service

**Protocol:** SOAP
**Service URL:** `http://localhost:8081/ws` (as per `air_quality.wsdl`)

### Operations:

-   **`GetAllZones`**: Retrieves air quality records for all available zones.
    -   **Request:** Empty body.
    -   **Example Response (excerpt):**
        ```xml
        <sch:GetAllZonesResponse>
            <sch:records>
                <sch:zoneName>Tunis Center</sch:zoneName>
                <sch:aqi>110</sch:aqi>
                <sch:status>Moderate</sch:status>
                <!-- ... other fields ... -->
            </sch:records>
            <!-- ... more records ... -->
        </sch:GetAllZonesResponse>
        ```
-   **`GetAirQuality`**: Retrieves air quality for a single specified zone.
    -   **Example Request:**
        ```xml
        <sch:GetAirQualityRequest>
            <sch:zoneName>Tunis Center</sch:zoneName>
        </sch:GetAirQualityRequest>
        ```
    -   **Example Response:**
        ```xml
        <sch:GetAirQualityResponse>
            <sch:record>
                <sch:zoneName>Tunis Center</sch:zoneName>
                <sch:aqi>110</sch:aqi>
                <sch:status>Moderate</sch:status>
                <sch:pm10>45.0</sch:pm10>
                <sch:no2>55.0</sch:no2>
                <sch:co2>420.0</sch:co2>
                <sch:o3>25.0</o3>
                <sch:timestamp>...</sch:timestamp>
            </sch:record>
        </sch:GetAirQualityResponse>
        ```
-   **`CompareAirQuality`**: Compares air quality between two specified zones.
    -   **Example Request:**
        ```xml
        <sch:CompareAirQualityRequest>
            <sch:zone1>Tunis Center</sch:zone1>
            <sch:zone2>Sidi Bou Said</sch:zone2>
        </sch:CompareAirQualityRequest>
        ```
    -   **Example Response:**
        ```xml
        <sch:CompareAirQualityResponse>
            <sch:record1>
                <!-- ... AirQualityRecord for Tunis Center ... -->
            </sch:record1>
            <sch:record2>
                <!-- ... AirQualityRecord for Sidi Bou Said ... -->
            </sch:record2>
            <sch:verdict>Tunis Center has higher pollution than Sidi Bou Said.</sch:verdict>
        </sch:CompareAirQualityResponse>
        ```

---

## 3. GraphQL City Service

**Protocol:** GraphQL
**GraphQL Playground:** `http://localhost:4000/graphql`

### Key Queries:

-   **`zones`**: Get all zones.
    -   **Example Query:**
        ```graphql
        query {
          zones {
            id
            name
          }
        }
        ```
-   **`pointsOfInterest(filter: POIFilter)`**: Get POIs with optional filters.
    -   **Example Query:**
        ```graphql
        query {
          pointsOfInterest(filter: { minRating: 4, zoneId: "zone-8" }) {
            name
            rating
            zone { name }
          }
        }
        ```
-   **`upcomingEvents(limit: Int)`**: Get a limited number of upcoming events.
    -   **Example Query:**
        ```graphql
        query {
          upcomingEvents(limit: 3) {
            title
            zone { name }
            startDate
          }
        }
        ```
-   **`cityStats`**: Get overall city statistics.
    -   **Example Query:**
        ```graphql
        query {
          cityStats {
            totalPOIs
            totalEvents
            averageRating
          }
        }
        ```

### Key Mutations:

-   **`createPOI(input: CreatePOIInput!)`**: Create a new Point of Interest.
    -   **Example Mutation:**
        ```graphql
        mutation {
          createPOI(input: {
            name: "Café Saf Saf"
            description: "Traditional café"
            categoryId: "cat-7"
            zoneId: "zone-6"
            address: "Avenue de la Liberté"
          }) {
            id
            name
          }
        }
        ```
-   **`addReview(input: AddReviewInput!)`**: Add a review to a POI.
    -   **Example Mutation:**
        ```graphql
        mutation {
          addReview(input: {
            poiId: "poi-1"
            author: "User"
            comment: "Great experience!"
            rating: 5
          }) {
            name
            reviews { comment rating }
          }
        }
        ```
-   **`registerForEvent(input: EventRegistrationInput!)`**: Register for an event.
    -   **Example Mutation:**
        ```graphql
        mutation {
          registerForEvent(input: {
            eventId: "evt-2"
            attendeeName: "Amine"
            attendeeEmail: "amine@example.com"
          }) {
            title
            registeredCount
          }
        }
        ```

---

## 4. gRPC Emergency Alert Service

**Protocol:** gRPC
**Service:** `EmergencyAlertService` (defined in `emergency.proto`)

### RPC Methods:

-   **`CreateAlert`**: Creates a new emergency alert.
    -   **Request Message (`CreateAlertRequest`):**
        ```protobuf
        message CreateAlertRequest {
          AlertType type = 1;
          string zone = 2;
          string description = 3;
          double latitude = 4;
          double longitude = 5;
          string reporter_phone = 6;
        }
        ```
    -   **Example Request Payload (JSON representation):**
        ```json
        {
          "type": "FIRE",
          "zone": "Charguia",
          "description": "Building fire near main road",
          "latitude": 36.83,
          "longitude": 10.12,
          "reporter_phone": "+216 20 000 000"
        }
        ```
-   **`GetAlert`**: Retrieves an emergency alert by its ID.
    -   **Request Message (`GetAlertRequest`):**
        ```protobuf
        message GetAlertRequest {
          string id = 1;
        }
        ```
    -   **Example Request Payload (JSON representation):**
        ```json
        {
          "id": "some-alert-uuid"
        }
        ```
-   **`GetAlertsByZone`**: Retrieves alerts for a specific zone, with an optional status filter.
    -   **Request Message (`GetAlertsByZoneRequest`):**
        ```protobuf
        message GetAlertsByZoneRequest {
          string zone = 1;
          AlertStatus status_filter = 2;
        }
        ```
    -   **Example Request Payload (JSON representation, from `example_request.json`):**
        ```json
        {"zone": "Downtown"}
        ```
-   **`UpdateAlertStatus`**: Updates the status of an existing alert.
    -   **Request Message (`UpdateAlertStatusRequest`):**
        ```protobuf
        message UpdateAlertStatusRequest {
          string id = 1;
          AlertStatus new_status = 2;
        }
        ```
    -   **Example Request Payload (JSON representation):**
        ```json
        {
          "id": "some-alert-uuid",
          "new_status": "RESOLVED"
        }
        ```
-   **`StreamAlerts`**: Server-streaming RPC to get real-time updates on alerts.
    -   **Request Message (`StreamAlertsRequest`):**
        ```protobuf
        message StreamAlertsRequest {
          string zone = 1;
        }
        ```
    -   **Example Request Payload (JSON representation):**
        ```json
        {"zone": "Tunis Center"} // or empty for all zones
        ```
