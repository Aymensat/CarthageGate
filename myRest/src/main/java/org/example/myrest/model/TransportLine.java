package org.example.myrest.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "transport_line")
public class TransportLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Better than AUTO
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "line_type", nullable = false)  // Explicit column name
    private LineType lineType;

    @Enumerated(EnumType.STRING)
    @Column(name = "line_status", nullable = false)
    private LineStatus lineStatus;

    @Column(columnDefinition = "TEXT")  // For longer text
    private String description;

    @JsonManagedReference
    @OneToMany(mappedBy = "transportLine", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Schedule> schedules = new ArrayList<>();  // Lowercase and initialized

    // Constructors
    public TransportLine() {}

    public TransportLine(String name, LineType lineType, LineStatus lineStatus, String description) {
        this.name = name;
        this.lineType = lineType;
        this.lineStatus = lineStatus;
        this.description = description;
    }

    // Helper method to manage bidirectional relationship
    public void addSchedule(Schedule schedule) {
        schedules.add(schedule);
        schedule.setTransportLine(this);
    }

    public void removeSchedule(Schedule schedule) {
        schedules.remove(schedule);
        schedule.setTransportLine(null);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LineType getLineType() { return lineType; }
    public void setLineType(LineType lineType) { this.lineType = lineType; }

    public LineStatus getLineStatus() { return lineStatus; }
    public void setLineStatus(LineStatus lineStatus) { this.lineStatus = lineStatus; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<Schedule> getSchedules() { return schedules; }
    public void setSchedules(List<Schedule> schedules) {  // Use List, not ArrayList
        this.schedules = schedules;
    }
}