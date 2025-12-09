package org.example.myrest.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "schedule")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @JoinColumn(name = "line_id", nullable = false)
    private TransportLine transportLine;

    @Column(name = "station_from", nullable = false)
    private String stationFrom;

    @Column(name = "station_to", nullable = false)
    private String stationTo;

    @Column(name = "departure_time", nullable = false)
    private LocalTime departureTime;

    @Column(name = "arrival_time", nullable = false)
    private LocalTime arrivalTime;

    // Constructors
    public Schedule() {}

    public Schedule(TransportLine transportLine, String stationFrom, String stationTo,
                    LocalTime departureTime, LocalTime arrivalTime) {
        this.transportLine = transportLine;
        this.stationFrom = stationFrom;
        this.stationTo = stationTo;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TransportLine getTransportLine() { return transportLine; }
    public void setTransportLine(TransportLine transportLine) {
        this.transportLine = transportLine;
    }

    public String getStationFrom() { return stationFrom; }
    public void setStationFrom(String stationFrom) { this.stationFrom = stationFrom; }

    public String getStationTo() { return stationTo; }
    public void setStationTo(String stationTo) { this.stationTo = stationTo; }

    public LocalTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalTime departureTime) { this.departureTime = departureTime; }

    public LocalTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalTime arrivalTime) { this.arrivalTime = arrivalTime; }
}