package org.example.myrest.controller;

import org.example.myrest.model.Schedule;
import org.example.myrest.service.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService service;

    public ScheduleController(ScheduleService service) {
        this.service = service;
    }

    // GET /api/schedules - Get all schedules
    @GetMapping
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        List<Schedule> schedules = service.getAllSchedules();
        return ResponseEntity.ok(schedules);
    }

    // GET /api/schedules/{id} - Get schedule by ID
    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable Long id) {
        return service.getScheduleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/schedules/line/{lineId} - Get schedules for specific line
    @GetMapping("/line/{lineId}")
    public ResponseEntity<List<Schedule>> getSchedulesByLine(@PathVariable Long lineId) {
        List<Schedule> schedules = service.getSchedulesByLineId(lineId);
        return ResponseEntity.ok(schedules);
    }

    // POST /api/schedules - Create schedule
    @PostMapping
    public ResponseEntity<Schedule> createSchedule(@Valid @RequestBody ScheduleCreateRequest request) {
        Schedule schedule = request.toSchedule();
        Schedule created = service.createSchedule(schedule);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // DELETE /api/schedules/{id} - Delete schedule
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        service.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }

    // Exception handlers
    @ExceptionHandler(ScheduleService.ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ScheduleService.ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(IllegalArgumentException ex) {
        ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    // DTOs
    public static class ScheduleCreateRequest {
        private Long lineId;
        private String stationFrom;
        private String stationTo;
        private String departureTime;  // Format: "HH:mm"
        private String arrivalTime;    // Format: "HH:mm"

        public Schedule toSchedule() {
            Schedule schedule = new Schedule();
            schedule.setStationFrom(stationFrom);
            schedule.setStationTo(stationTo);
            schedule.setDepartureTime(java.time.LocalTime.parse(departureTime));
            schedule.setArrivalTime(java.time.LocalTime.parse(arrivalTime));

            // Set transport line with just the ID
            org.example.myrest.model.TransportLine line = new org.example.myrest.model.TransportLine();
            line.setId(lineId);
            schedule.setTransportLine(line);

            return schedule;
        }

        // Getters and Setters
        public Long getLineId() { return lineId; }
        public void setLineId(Long lineId) { this.lineId = lineId; }
        public String getStationFrom() { return stationFrom; }
        public void setStationFrom(String stationFrom) { this.stationFrom = stationFrom; }
        public String getStationTo() { return stationTo; }
        public void setStationTo(String stationTo) { this.stationTo = stationTo; }
        public String getDepartureTime() { return departureTime; }
        public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
        public String getArrivalTime() { return arrivalTime; }
        public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }
    }

    public static class ErrorResponse {
        private int status;
        private String message;

        public ErrorResponse(int status, String message) {
            this.status = status;
            this.message = message;
        }

        public int getStatus() { return status; }
        public void setStatus(int status) { this.status = status; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

//    @GetMapping("/{id}/availability")
//    public ResponseEntity<ScheduleService.ScheduleAvailability> checkAvailability(@PathVariable Long id) {
//        // Inject ScheduleService into TransportLineController constructor
//        ScheduleService.ScheduleAvailability availability = service.checkLineAvailability(id);
//        return ResponseEntity.ok(availability);
//    }



}