# REST Smart Mobility Service

This folder contains documentation and mock data related to the REST Smart Mobility Service.

## Contents:

-   **`openapi.json`**: The OpenAPI Specification (OAS) document for the REST API, detailing all available endpoints, request/response structures, and data models.
-   **`data.sql`**: SQL statements used to create the necessary tables and populate initial mock data for the PostgreSQL database used by this service.

## Service Description:

The REST Smart Mobility Service provides information related to public transportation, including transport lines, their statuses, and schedules. It offers a set of CRUD (Create, Read, Update, Delete) operations on these resources.

## Mock Data Details:

The `data.sql` file contains the `CREATE TABLE` statements for `transport_line` and `schedule` tables, along with `INSERT` statements to populate them with sample transport lines (Metro, Bus, TGM, Tram) and their respective schedules. This data is intended to be loaded into a PostgreSQL database (e.g., `my_rest_db`) to provide an initial dataset for the service.

## Example Usage:

The `openapi.json` file can be imported into tools like Postman or Swagger UI to explore the API interactively. The `data.sql` provides a quick way to set up a development database with sample data.
