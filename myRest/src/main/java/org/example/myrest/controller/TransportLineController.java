package org.example.myrest.controller;

import org.example.myrest.model.LineType;
import org.example.myrest.model.TransportLine;
import org.example.myrest.service.TransportLineService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/lines")
public class TransportLineController {

    private final TransportLineService service;

    public TransportLineController(TransportLineService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TransportLine>> getAllLines() {
        List<TransportLine> lines = service.getAllLines();
        return ResponseEntity.ok(lines);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransportLine> getLineById(@PathVariable Long id) {
        return service.getLineById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<TransportLine>> getLinesByType(@PathVariable LineType type) {
        List<TransportLine> lines = service.getLinesByType(type);
        return ResponseEntity.ok(lines);
    }

    @PostMapping
    public ResponseEntity<TransportLine> createLine(@Valid @RequestBody TransportLine line) {
        TransportLine created = service.createLine(line);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransportLine> updateLine(
            @PathVariable Long id,
            @Valid @RequestBody TransportLine line) {
        TransportLine updated = service.updateLine(id, line);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLine(@PathVariable Long id) {
        service.deleteLine(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(TransportLineService.ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(TransportLineService.ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(IllegalArgumentException ex) {
        ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
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
}