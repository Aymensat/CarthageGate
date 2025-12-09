package org.example.myrest.repository;

import org.example.myrest.model.LineType;
import org.example.myrest.model.TransportLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransportLineRepository  extends JpaRepository<TransportLine, Long> {
    List<TransportLine> findByLineType(LineType lineType);
    List<TransportLine> findByNameContainingIgnoreCase(String name);
    boolean existsByName(String name);
}
