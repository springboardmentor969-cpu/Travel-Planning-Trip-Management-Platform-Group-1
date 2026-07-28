package com.tripnest.controller;

import com.tripnest.dto.DestinationDto;
import com.tripnest.service.DestinationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {
    private final DestinationService service;
    public DestinationController(DestinationService service) { this.service = service; }
    @GetMapping public List<DestinationDto> list(@RequestParam(required = false) String query, @RequestParam(required = false) String region) { return service.list(query, region); }
    @GetMapping("/{id}") public DestinationDto get(@PathVariable Long id) { return service.get(id); }
    @PostMapping @PreAuthorize("hasRole('ADMIN')") public ResponseEntity<DestinationDto> create(@Valid @RequestBody DestinationDto dto) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto)); }
    @PutMapping("/{id}") @PreAuthorize("hasRole('ADMIN')") public DestinationDto update(@PathVariable Long id, @Valid @RequestBody DestinationDto dto) { return service.update(id, dto); }
    @DeleteMapping("/{id}") @PreAuthorize("hasRole('ADMIN')") public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
