require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

// Import service clients
const airQualityService = require('./src/services/airQualityService');
const { getAllSchedules, getAllLines } = require('./src/services/mobilityService'); // getAllLines for potential future use or dynamic mapping
const { getAlertsByZone, AlertStatus } = require('./src/services/emergencyService');

app.use(express.json()); // For parsing application/json

// --- Constants ---
// Map to link broader zones to specific station/location names used by services
const ZONE_STATION_MAP = {
    "Charguia": ["Charguia", "Charguia 2"],
    "Tunis Center": ["Tunis Center", "Tunis Marine", "République", "Barcelona", "Bab Bhar", "Jardin Thameur"],
    "Sidi Bou Said": ["Sidi Bou Said"],
    "Ariana": ["Ariana", "Ariana Center"],
    "Tunis Carthage Airport": ["Tunis Carthage Airport"],
    "La Marsa": ["La Marsa"],
    "La Goulette": ["La Goulette"], // TGM stop
};

// Helper to get all relevant locations for a given zone
const getLocationsForZone = (zone) => ZONE_STATION_MAP[zone] || [zone];

// AQI thresholds for warnings (example values)
const AQI_THRESHOLD_MODERATE = 50;
const AQI_THRESHOLD_UNHEALTHY_SENSITIVE = 100;
const AQI_THRESHOLD_UNHEALTHY = 150;

app.post('/api/plan-trip', async (req, res) => {
    const { startZone, destinationZone } = req.body;

    if (!startZone || !destinationZone) {
        return res.status(400).json({ error: 'Both startZone and destinationZone are required.' });
    }

    const tripPlan = {
        startZone,
        destinationZone,
        airQuality: null,
        transportOptions: [],
        emergencyAlerts: [],
        warnings: [],
        errors: []
    };

    // --- 1. Get Emergency Alerts (gRPC) ---
    try {
        const startZoneLocations = getLocationsForZone(startZone);
        const destinationZoneLocations = getLocationsForZone(destinationZone);
        const allRelevantLocations = [...new Set([...startZoneLocations, ...destinationZoneLocations])];

        const alertPromises = allRelevantLocations.map(async (location) => {
            try {
                // Filter for PENDING or IN_PROGRESS alerts
                const pendingAlerts = await getAlertsByZone(location, AlertStatus.PENDING);
                const inProgressAlerts = await getAlertsByZone(location, AlertStatus.IN_PROGRESS);
                return [...pendingAlerts, ...inProgressAlerts];
            } catch (err) {
                console.warn(`Could not fetch alerts for location ${location}: ${err.message}`);
                // Don't fail the whole request if one alert fetch fails
                return [];
            }
        });

        const allAlerts = (await Promise.all(alertPromises)).flat();
        // Remove duplicate alerts if any (e.g., same alert reported for two close locations)
        const uniqueAlerts = Array.from(new Map(allAlerts.map(alert => [alert.id, alert])).values());
        
        tripPlan.emergencyAlerts = uniqueAlerts;
        if (uniqueAlerts.length > 0) {
            tripPlan.warnings.push('Active emergency alerts in or near your zones.');
        }

    } catch (error) {
        console.error('Error in gRPC Emergency Alerts fetch:', error.message);
        tripPlan.errors.push(`Failed to retrieve emergency alerts: ${error.message}`);
    }

    // --- 2. Get Air Quality (SOAP) ---
    try {
        const airQualityRecord = await airQualityService.getAirQuality(startZone);
        tripPlan.airQuality = airQualityRecord;

        let airQualityWarning = '';
        if (airQualityRecord && airQualityRecord.aqi) {
            if (airQualityRecord.aqi >= AQI_THRESHOLD_UNHEALTHY) {
                airQualityWarning = `Air quality in ${startZone} is Unhealthy (${airQualityRecord.aqi} AQI). Consider alternative plans.`;
            } else if (airQualityRecord.aqi >= AQI_THRESHOLD_UNHEALTHY_SENSITIVE) {
                airQualityWarning = `Air quality in ${startZone} is Unhealthy for Sensitive Groups (${airQualityRecord.aqi} AQI).`;
            } else if (airQualityRecord.aqi >= AQI_THRESHOLD_MODERATE) {
                airQualityWarning = `Air quality in ${startZone} is Moderate (${airQualityRecord.aqi} AQI).`;
            }
        }
        if (airQualityWarning) {
            tripPlan.warnings.push(airQualityWarning);
        }

    } catch (error) {
        console.error('Error in SOAP Air Quality fetch:', error.message);
        tripPlan.errors.push(`Failed to retrieve air quality for ${startZone}: ${error.message}`);
    }

    // --- 3. Get Transport Options (REST) ---
    try {
        const allSchedules = await getAllSchedules();
        const startStations = getLocationsForZone(startZone);
        const destinationStations = getLocationsForZone(destinationZone);

        const directSchedules = allSchedules.filter(schedule => 
            startStations.includes(schedule.stationFrom) &&
            destinationStations.includes(schedule.stationTo)
        );

        tripPlan.transportOptions = directSchedules;
        if (directSchedules.length === 0) {
            tripPlan.warnings.push(`No direct transport options found from ${startZone} to ${destinationZone}.`);
        }

    } catch (error) {
        console.error('Error in REST Mobility fetch:', error.message);
        tripPlan.errors.push(`Failed to retrieve transport options: ${error.message}`);
    }
    
    // Add a general message if no specific errors, but some warnings
    if (tripPlan.errors.length === 0 && tripPlan.warnings.length > 0) {
        tripPlan.message = "Trip plan generated with warnings.";
    } else if (tripPlan.errors.length === 0 && tripPlan.warnings.length === 0) {
        tripPlan.message = "Trip plan generated successfully.";
    } else {
        tripPlan.message = "Trip plan generated with errors and warnings.";
    }


    res.json(tripPlan);
});

app.listen(port, () => {
    console.log(`Orchestrator service listening at http://localhost:${port}`);
});
