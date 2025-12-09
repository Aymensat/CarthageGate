package org.example.myrest.repository;

import org.example.myrest.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // Find all schedules for a specific transport line
    List<Schedule> findByTransportLineId(Long lineId);

    // Find schedules departing after a specific time for a line
    List<Schedule> findByTransportLineIdAndDepartureTimeAfterOrderByDepartureTimeAsc(
            Long lineId, LocalTime time);

    // Find next departure for a line
    @Query("SELECT s FROM Schedule s WHERE s.transportLine.id = :lineId " +
            "AND s.departureTime > :currentTime ORDER BY s.departureTime ASC")
    Optional<Schedule> findNextDeparture(@Param("lineId") Long lineId,
                                         @Param("currentTime") LocalTime currentTime);

    // Optional: Find schedules by station
    List<Schedule> findByStationFromOrStationTo(String stationFrom, String stationTo);
}