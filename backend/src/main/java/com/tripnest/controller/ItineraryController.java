package com.tripnest.controller;

import com.tripnest.dto.ItineraryDto;
import com.tripnest.service.ItineraryService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trips/{tripId}/itinerary")
public class ItineraryController {
    private final ItineraryService itineraryService;

    public ItineraryController(ItineraryService itineraryService) {
        this.itineraryService = itineraryService;
    }

    @PostMapping
    public ResponseEntity<ItineraryDto> create(@PathVariable Long tripId, @Valid @RequestBody ItineraryDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(itineraryService.create(tripId, dto));
    }

    @GetMapping
    public ResponseEntity<List<ItineraryDto>> list(@PathVariable Long tripId) {
        return ResponseEntity.ok(itineraryService.list(tripId));
    }

    @PutMapping("/{itineraryId}")
    public ResponseEntity<ItineraryDto> update(
            @PathVariable Long tripId,
            @PathVariable Long itineraryId,
            @Valid @RequestBody ItineraryDto dto
    ) {
        return ResponseEntity.ok(itineraryService.update(tripId, itineraryId, dto));
    }

    @DeleteMapping("/{itineraryId}")
    public ResponseEntity<Void> delete(@PathVariable Long tripId, @PathVariable Long itineraryId) {
        itineraryService.delete(tripId, itineraryId);
        return ResponseEntity.noContent().build();
    }
}
