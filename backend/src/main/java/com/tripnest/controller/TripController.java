package com.tripnest.controller;

import com.tripnest.dto.TripDetailsDto;
import com.tripnest.dto.TripDto;
import com.tripnest.service.TripService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trips")
public class TripController {
    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TripDto> create(@Valid @RequestBody TripDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tripService.create(dto));
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<TripDto>> list(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(tripService.list(userId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TripDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.get(id));
    }

    @GetMapping("/{id}/details")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TripDetailsDto> getDetails(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.getDetails(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TripDto> update(@PathVariable Long id, @Valid @RequestBody TripDto dto) {
        return ResponseEntity.ok(tripService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tripService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
