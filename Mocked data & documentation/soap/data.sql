-- src/main/resources/data.sql
-- This file inserts initial data when the app starts

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA: Air quality for Tunis zones
-- Based on realistic values for each area
-- ═══════════════════════════════════════════════════════════════════════════

-- Clear existing data (for clean restarts)
DELETE FROM air_quality_zones;

-- Industrial Zone - Worst air quality
INSERT INTO air_quality_zones (zone_name, aqi, status, pm10, no2, co2, o3, description)
VALUES ('Charguia 2', 185, 'Unhealthy', 95.5, 60.2, 450.0, 15.0, 
        'Industrial zone with factories and heavy truck traffic');

-- City Center - Moderate (traffic pollution)
INSERT INTO air_quality_zones (zone_name, aqi, status, pm10, no2, co2, o3, description)
VALUES ('Tunis Center', 110, 'Moderate', 45.0, 55.0, 420.0, 25.0,
        'Downtown area with heavy car traffic and commercial activity');

-- Coastal Tourist Area - Best air quality
INSERT INTO air_quality_zones (zone_name, aqi, status, pm10, no2, co2, o3, description)
VALUES ('Sidi Bou Said', 35, 'Good', 12.0, 10.0, 400.0, 35.0,
        'Coastal village with sea breeze and minimal traffic');

-- Suburban Residential - Fair
INSERT INTO air_quality_zones (zone_name, aqi, status, pm10, no2, co2, o3, description)
VALUES ('Ariana', 75, 'Fair', 28.0, 30.0, 410.0, 20.0,
        'Suburban residential area with moderate traffic');

-- Airport Area - Unhealthy for sensitive groups
INSERT INTO air_quality_zones (zone_name, aqi, status, pm10, no2, co2, o3, description)
VALUES ('Tunis Carthage Airport', 130, 'Unhealthy for Sensitive Groups', 55.0, 48.0, 435.0, 18.0,
        'Airport area with aircraft emissions and road traffic');