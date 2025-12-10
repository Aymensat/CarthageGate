-- src/main/resources/schema.sql
-- This file creates the database tables when the app starts

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: air_quality_zones
-- Stores air quality data for each zone in Tunis
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS air_quality_zones (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    zone_name   VARCHAR(100) NOT NULL UNIQUE,
    aqi         INT NOT NULL,
    status      VARCHAR(50) NOT NULL,
    pm10        DOUBLE,
    no2         DOUBLE,
    co2         DOUBLE,
    o3          DOUBLE,
    description VARCHAR(500)
);