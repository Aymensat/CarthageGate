// src/main/java/org/example/soap/endpoint/AirQualityEndpoint.java
package org.example.soap.endpoint;

import org.example.soap.generated.*;
import org.example.soap.service.AirQualityService;
import org.springframework.ws.server.endpoint.annotation.*;

import java.util.List;

/**
 * SOAP ENDPOINT
 * ══════════════
 * 
 * This is the "controller" for SOAP requests.
 * It receives XML, converts to Java objects, calls Service, returns XML.
 * 
 * ANNOTATIONS EXPLAINED:
 * ──────────────────────
 * @Endpoint → Tells Spring WS: "This class handles SOAP requests"
 * 
 * @PayloadRoot → "When you receive XML with this namespace and element name,
 *                 call THIS method"
 * 
 * @RequestPayload → "Convert the incoming XML body to this Java object"
 * 
 * @ResponsePayload → "Convert the returned Java object back to XML"
 */
 @Endpoint
public class AirQualityEndpoint {

    // The XML namespace - must match your XSD!
    private static final String NAMESPACE_URI = "http://example.com/air-quality-service";

    // Service handles business logic (injected by Spring)
    private final AirQualityService airQualityService;

    public AirQualityEndpoint(AirQualityService airQualityService) {
        this.airQualityService = airQualityService;
    }

    // ═══════════════════════════════════════════════════════════════════
    // OPERATION 1: Get Single Zone
    // ═══════════════════════════════════════════════════════════════════
    
    /**
     * Handles: GetAirQualityRequest
     * Returns: GetAirQualityResponse
     * 
     * Example SOAP Request:
     * <GetAirQualityRequest xmlns="http://example.com/air-quality-service">
     *     <zoneName>Tunis Center</zoneName>
     * </GetAirQualityRequest>
     */
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "GetAirQualityRequest")
    @ResponsePayload
    public GetAirQualityResponse getAirQuality( @RequestPayload GetAirQualityRequest request) {
        
        // 1. Extract data from SOAP request
        String zoneName = request.getZoneName();
        
        // 2. Call service (business logic)
        AirQualityRecord record = airQualityService.getAirQualityByZone(zoneName);
        
        // 3. Build SOAP response
        GetAirQualityResponse response = new GetAirQualityResponse();
        response.setRecord(record);
        
        return response;
    }

    // ═══════════════════════════════════════════════════════════════════
    // OPERATION 2: Compare Two Zones
    // ═══════════════════════════════════════════════════════════════════
    
    /**
     * Handles: CompareAirQualityRequest
     * Returns: CompareAirQualityResponse with verdict
     */
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "CompareAirQualityRequest")
    @ResponsePayload
    public CompareAirQualityResponse compareAirQuality(
            @RequestPayload CompareAirQualityRequest request) {
        
        // Call service
        AirQualityService.ComparisonResult result = 
            airQualityService.compareZones(request.getZone1(), request.getZone2());
        
        // Build response
        CompareAirQualityResponse response = new CompareAirQualityResponse();
        response.setRecord1(result.record1());
        response.setRecord2(result.record2());
        response.setVerdict(result.verdict());
        
        return response;
    }

    // ═══════════════════════════════════════════════════════════════════
    // OPERATION 3: Get All Zones
    // ═══════════════════════════════════════════════════════════════════
    
    /**
     * Handles: GetAllZonesRequest
     * Returns: GetAllZonesResponse with list of all zones
     */
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "GetAllZonesRequest")
    @ResponsePayload
    public GetAllZonesResponse getAllZones( @RequestPayload GetAllZonesRequest request) {
        
        // Get all zones from service
        List<AirQualityRecord> allRecords = airQualityService.getAllZones();
        
        // Build response
        GetAllZonesResponse response = new GetAllZonesResponse();
        response.getRecords().addAll(allRecords);  // Add all records to list
        
        return response;
    }
}