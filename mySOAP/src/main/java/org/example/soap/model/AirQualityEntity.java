// src/main/java/org/example/soap/model/AirQualityEntity.java
package org.example.soap.model;

import jakarta.persistence.*;

/**
 * DATABASE ENTITY
 * ════════════════
 * 
 * This class represents a ROW in the database table. 
 * 
 * JPA (Java Persistence API) annotations tell Spring:
 * - @Entity → "This class maps to a database table"
 * - @Table  → "The table name is 'air_quality_zones'"
 * - @Id     → "This field is the primary key"
 * - @Column → "This field maps to this column name"
 * 
 * WHY SEPARATE FROM GENERATED CLASSES?
 * ─────────────────────────────────────
 * The XSD generates classes for SOAP messages (GetAirQualityRequest, etc.)
 * This Entity is for DATABASE storage. They have different purposes! 
 * 
 * We convert between them in the Service layer.
 */
 @Entity @Table(name = "air_quality_zones")
public class AirQualityEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment
    private Long id;

    @Column(name = "zone_name", unique = true, nullable = false)
    private String zoneName;

    @Column(nullable = false)
    private int aqi;

    @Column(nullable = false)
    private String status;

    // Pollutant levels (all in μg/m³ except CO2 in ppm)
    private double pm10;
    private double no2;
    private double co2;
    private double o3;

    @Column(length = 500)
    private String description;  // Extra: explains why this zone has this AQI

    // ═══════════════════════════════════════════════════════════════════
    // CONSTRUCTORS
    // ═══════════════════════════════════════════════════════════════════
    
    // JPA requires a no-args constructor
    public AirQualityEntity() {}

    // Convenient constructor for creating test data
    public AirQualityEntity(String zoneName, int aqi, String status,
                            double pm10, double no2, double co2, double o3,
                            String description) {
        this.zoneName = zoneName;
        this.aqi = aqi;
        this.status = status;
        this.pm10 = pm10;
        this.no2 = no2;
        this.co2 = co2;
        this.o3 = o3;
        this.description = description;
    }

    // ═══════════════════════════════════════════════════════════════════
    // GETTERS AND SETTERS
    // JPA uses these to read/write data
    // ═══════════════════════════════════════════════════════════════════

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }

    public int getAqi() { return aqi; }
    public void setAqi(int aqi) { this.aqi = aqi; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public double getPm10() { return pm10; }
    public void setPm10(double pm10) { this.pm10 = pm10; }

    public double getNo2() { return no2; }
    public void setNo2(double no2) { this.no2 = no2; }

    public double getCo2() { return co2; }
    public void setCo2(double co2) { this.co2 = co2; }

    public double getO3() { return o3; }
    public void setO3(double o3) { this.o3 = o3; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    @Override
    public String toString() {
        return "AirQualityEntity{"
                + "zoneName='" + zoneName + '\'' +
                ", aqi=" + aqi +
                ", status='" + status + '\'' +
                '}';
    }
}
