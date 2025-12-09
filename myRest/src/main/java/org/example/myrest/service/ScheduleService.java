package org.example.myrest.service;

import org.example.myrest.model.Schedule;
import org.example.myrest.model.TransportLine;
import org.example.myrest.repository.ScheduleRepository;
import org.example.myrest.repository.TransportLineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final TransportLineRepository lineRepository;

    public ScheduleService(ScheduleRepository scheduleRepository,
                           TransportLineRepository lineRepository) {
        this.scheduleRepository = scheduleRepository;
        this.lineRepository = lineRepository;
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public Optional<Schedule> getScheduleById(Long id) {
        return scheduleRepository.findById(id);
    }

    public List<Schedule> getSchedulesByLineId(Long lineId) {
        // Validate that line exists
        if (!lineRepository.existsById(lineId)) {
            throw new ResourceNotFoundException("TransportLine not found with id: " + lineId);
        }
        return scheduleRepository.findByTransportLineId(lineId);
    }

    @Transactional
    public Schedule createSchedule(Schedule schedule) {
        // Validate that the transport line exists
        if (schedule.getTransportLine() == null || schedule.getTransportLine().getId() == null) {
            throw new IllegalArgumentException("Transport line must be specified");
        }

        TransportLine line = lineRepository.findById(schedule.getTransportLine().getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "TransportLine not found with id: " + schedule.getTransportLine().getId()));

        // Validate times
        if (schedule.getDepartureTime().isAfter(schedule.getArrivalTime())) {
            throw new IllegalArgumentException("Departure time must be before arrival time");
        }

        schedule.setTransportLine(line);
        return scheduleRepository.save(schedule);
    }

    @Transactional
    public void deleteSchedule(Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Schedule not found with id: " + id);
        }
        scheduleRepository.deleteById(id);
    }

    // Bonus method for availability check
//    public ScheduleAvailability checkLineAvailability(Long lineId) {
//        TransportLine line = lineRepository.findById(lineId)
//                .orElseThrow(() -> new ResourceNotFoundException("TransportLine not found with id: " + lineId));
//
//        LocalTime now = LocalTime.now();
//        Optional<Schedule> nextDeparture = scheduleRepository.findNextDeparture(lineId, now);
//
//        return new ScheduleAvailability(
//                line.getLineStatus().toString(),
//                line.getName(),
//                nextDeparture.map(Schedule::getDepartureTime).orElse(null),
//                nextDeparture.map(Schedule::getStationFrom).orElse(null),
//                nextDeparture.map(Schedule::getStationTo).orElse(null)
//        );
//    }

    // DTOs and Exceptions
    public static class ScheduleAvailability {
        private String status;
        private String lineName;
        private LocalTime nextDeparture;
        private String nextDepartureFrom;
        private String nextDepartureTo;

        public ScheduleAvailability(String status, String lineName, LocalTime nextDeparture,
                                    String nextDepartureFrom, String nextDepartureTo) {
            this.status = status;
            this.lineName = lineName;
            this.nextDeparture = nextDeparture;
            this.nextDepartureFrom = nextDepartureFrom;
            this.nextDepartureTo = nextDepartureTo;
        }

        // Getters
        public String getStatus() { return status; }
        public String getLineName() { return lineName; }
        public LocalTime getNextDeparture() { return nextDeparture; }
        public String getNextDepartureFrom() { return nextDepartureFrom; }
        public String getNextDepartureTo() { return nextDepartureTo; }
    }

    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }
}