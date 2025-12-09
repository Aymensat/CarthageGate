// src/main/java/org/example/soap/service/AirQualityService.java
package org.example.soap.service;

import org.example.soap.generated.AirQualityRecord;
import org.example.soap.model.AirQualityEntity;
import org.example.soap.repository.AirQualityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * SERVICE LAYER
 * ══════════════
 * 
 * This is where BUSINESS LOGIC lives.
 * 
 * WHAT IS BUSINESS LOGIC?
 * ───────────────────────
 * - "If AQI > 150, status is Unhealthy" → Business rule
 * - "Zone1 is cleaner if AQI is lower" → Business rule
 * - "Add current timestamp to records" → Business requirement
 * 
 * WHY SEPARATE FROM ENDPOINT?
 * ───────────────────────────
 * - Endpoint handles SOAP XML conversion (technical)
 * - Service handles WHAT the app actually does (business)
 * 
 * If you later add a REST API, you can reuse this Service!
 */
 @Service  // Tells Spring: "This is a service component, manage it for me"
public class AirQualityService {

    // Repository is INJECTED by Spring (Dependency Injection)
    private final AirQualityRepository repository;

    /**
     * CONSTRUCTOR INJECTION
     * ─────────────────────
     * Spring sees this constructor needs AirQualityRepository,
     * so it automatically provides one. You don't create it manually!
     * 
     * This is called "Dependency Injection" - a core Spring concept.
     */
    public AirQualityService(AirQualityRepository repository) {
        this.repository = repository;
    }

    // ═══════════════════════════════════════════════════════════════════
    // PUBLIC METHODS (called by Endpoint)
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Get air quality data for a specific zone.
     * 
     * @param zoneName The zone to look up
     * @return AirQualityRecord (the SOAP response type)
     * @throws ZoneNotFoundException if zone doesn't exist
     */
    public AirQualityRecord getAirQualityByZone(String zoneName) {
        // 1. Query the database
        AirQualityEntity entity = repository.findByZoneNameIgnoreCase(zoneName)
                .orElseThrow(() -> new ZoneNotFoundException(
                    "Zone not found: " + zoneName + 
                    ". Available zones: Charguia 2, Tunis Center, Sidi Bou Said, Ariana"
                ));

        // 2. Convert Entity → SOAP Record
        return convertToRecord(entity);
    }

    /**
     * Get all available zones.
     */
    public List<AirQualityRecord> getAllZones() {
        return repository.findAll()
                .stream()                           // Java Streams - process list
                .map(this::convertToRecord)         // Convert each entity
                .collect(Collectors.toList());      // Collect back to list
    }

    /**
     * Compare two zones and determine which is cleaner.
     * 
     * BUSINESS LOGIC EXAMPLE:
     * - Compare AQI values
     * - Generate human-readable verdict
     */
    public ComparisonResult compareZones(String zoneName1, String zoneName2) {
        // Get both zones (will throw if not found)
        AirQualityRecord record1 = getAirQualityByZone(zoneName1);
        AirQualityRecord record2 = getAirQualityByZone(zoneName2);

        // Business Logic: Compare AQI values
        String verdict;
        if (record1.getAqi() < record2.getAqi()) {
            verdict = record1.getZoneName() + " is cleaner than " + record2.getZoneName() +
                      " (AQI: " + record1.getAqi() + " vs " + record2.getAqi() + ")";
        } else if (record1.getAqi() > record2.getAqi()) {
            verdict = record2.getZoneName() + " is cleaner than " + record1.getZoneName() +
                      " (AQI: " + record2.getAqi() + " vs " + record1.getAqi() + ")";
        } else {
            verdict = "Both zones have similar air quality (AQI: " + record1.getAqi() + ")";
        }

        return new ComparisonResult(record1, record2, verdict);
    }

    // ═══════════════════════════════════════════════════════════════════
    // PRIVATE HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Convert database Entity to SOAP Record.
     * 
     * WHY DO WE CONVERT?
     * ──────────────────
     * - AirQualityEntity = Database representation (JPA annotations)
     * - AirQualityRecord = SOAP representation (generated from XSD)
     * 
     * They look similar but serve different purposes.
     * This separation is called "DTO pattern" (Data Transfer Object).
     */
    private AirQualityRecord convertToRecord(AirQualityEntity entity) {
        AirQualityRecord record = new AirQualityRecord();
        
        record.setZoneName(entity.getZoneName());
        record.setAqi(entity.getAqi());
        record.setStatus(entity.getStatus());
        record.setPm10(entity.getPm10());
        record.setNo2(entity.getNo2());
        record.setCo2(entity.getCo2());
        record.setO3(entity.getO3());
        
        // Add current timestamp (business requirement: always show fresh time)
        record.setTimestamp(LocalDateTime.now().toString());
        
        return record;
    }

    // ═══════════════════════════════════════════════════════════════════
    // INNER CLASSES
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Simple container for comparison results.
     * This is a "Record" in modern Java - immutable data holder.
     */
    public record ComparisonResult(
        AirQualityRecord record1,
        AirQualityRecord record2,
        String verdict
    ) {}

    /**
     * Custom exception for when a zone is not found.
     * Better than returning null - makes errors clear!
     */
    public static class ZoneNotFoundException extends RuntimeException {
        public ZoneNotFoundException(String message) {
            super(message);
        }
    }
}