// src/main/java/org/example/soap/repository/AirQualityRepository.java
package org.example.soap.repository;

import org.example.soap.model.AirQualityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * REPOSITORY INTERFACE
 * ═════════════════════
 * 
 * THE MAGIC OF SPRING DATA JPA:
 * ─────────────────────────────
 * You write JUST the interface. Spring creates the implementation automatically!
 * 
 * JpaRepository<AirQualityEntity, Long> gives you FOR FREE:
 *   - findAll()           → SELECT * FROM air_quality_zones
 *   - findById(id)        → SELECT * WHERE id = ?
 *   - save(entity)        → INSERT or UPDATE
 *   - deleteById(id)      → DELETE WHERE id = ?
 * 
 * CUSTOM QUERIES:
 * ───────────────
 * Just follow naming conventions, Spring writes the SQL!
 * 
 *   findByZoneName(name)  → SELECT * WHERE zone_name = ?
 *   findByAqiGreaterThan(100) → SELECT * WHERE aqi > 100
 * 
 * HOW DOES THIS WORK?
 * ───────────────────
 * Spring reads the method name "findByZoneName" and understands:
 *   - "find" = SELECT query
 *   - "By" = WHERE clause
 *   - "ZoneName" = column zone_name (from the Entity field)
 */
 @Repository  // Tells Spring: "This is a data access component"
public interface AirQualityRepository extends JpaRepository<AirQualityEntity, Long> {

    /**
     * Find a zone by its name (case-insensitive).
     * 
     * Spring generates: SELECT * FROM air_quality_zones 
     *                   WHERE LOWER(zone_name) = LOWER(?)
     * 
     * Returns Optional because the zone might not exist.
     * Optional forces you to handle "not found" case - good practice!
     */
    Optional<AirQualityEntity> findByZoneNameIgnoreCase(String zoneName);

    /**
     * Check if a zone exists.
     * 
     * Spring generates: SELECT COUNT(*) > 0 FROM air_quality_zones
     *                   WHERE LOWER(zone_name) = LOWER(?)
     */
    boolean existsByZoneNameIgnoreCase(String zoneName);
}