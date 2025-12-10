# SOAP Air Quality Service

This folder contains documentation and mock data related to the SOAP Air Quality Service.

## Contents:

-   **`air_quality.wsdl`**: The Web Services Description Language (WSDL) file for the SOAP API, describing the available operations, messages, and data types.
-   **`data.sql`**: SQL `INSERT` statements for populating the `air_quality_zones` table with sample air quality data.
-   **`schema.sql`**: SQL `CREATE TABLE` statement for the `air_quality_zones` table, defining its structure.

## Service Description:

The SOAP Air Quality Service provides real-time and historical air quality indices for different zones within a city. It allows clients to query AQI, pollutant levels (PM10, NO2, CO2, O3), and compare air quality between zones.

## Mock Data Details:

The `data.sql` and `schema.sql` files define the database structure and initial data for the air quality service. The `data.sql` includes sample air quality records for various zones like 'Charguia 2', 'Tunis Center', and 'Sidi Bou Said', with different AQI levels and statuses. This data is typically used to seed an H2 in-memory database or a similar relational database during application startup.

## Example Usage:

The `air_quality.wsdl` file can be used by SOAP clients to generate client stubs and interact with the service. The `data.sql` and `schema.sql` can be used to set up a local database for development and testing.
