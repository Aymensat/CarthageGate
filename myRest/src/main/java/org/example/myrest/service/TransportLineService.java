package org.example.myrest.service;


import org.example.myrest.model.LineType;
import org.example.myrest.model.TransportLine;
import org.example.myrest.repository.TransportLineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class TransportLineService {

    private final TransportLineRepository repository;

    public TransportLineService(TransportLineRepository repository) {
        this.repository = repository;
    }

    public List<TransportLine> getAllLines() {
        return repository.findAll();
    }

    public Optional<TransportLine> getLineById(Long id) {
        return repository.findById(id);
    }

    public List<TransportLine> getLinesByType(LineType lineType) {
        return repository.findByLineType(lineType);
    }

    @Transactional
    public TransportLine createLine(TransportLine line) {
        if (repository.existsByName(line.getName())) {
            throw new IllegalArgumentException("Line with name '" + line.getName() + "' already exists");
        }
        return repository.save(line);
    }

    @Transactional
    public TransportLine updateLine(Long id, TransportLine updatedLine) {
        return repository.findById(id)
                .map(existingLine -> {
                    existingLine.setName(updatedLine.getName());
                    existingLine.setLineType(updatedLine.getLineType());
                    existingLine.setLineStatus(updatedLine.getLineStatus());
                    existingLine.setDescription(updatedLine.getDescription());
                    return repository.save(existingLine);
                })
                .orElseThrow(() -> new ResourceNotFoundException("TransportLine not found with id: " + id));
    }

    @Transactional
    public void deleteLine(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("TransportLine not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }
}