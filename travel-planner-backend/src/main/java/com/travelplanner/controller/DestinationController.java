package com.travelplanner.controller;

import com.travelplanner.entity.Destination;
import com.travelplanner.repository.DestinationRepository;
import com.travelplanner.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    @Autowired
    private DestinationRepository destinationRepository;

    @GetMapping
    public ResponseEntity<List<Destination>> getAllDestinations() {
        return ResponseEntity.ok(destinationRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Destination> getDestinationById(@PathVariable Long id) {
        Destination destination = destinationRepository.findById(id).orElse(null);
        if (destination == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(destination);
    }

    @PostMapping
    public ResponseEntity<?> addDestination(@RequestBody Destination destinationRequest) {
        Destination destination = new Destination();
        destination.setName(destinationRequest.getName());
        destination.setDescription(destinationRequest.getDescription());
        destination.setLocation(destinationRequest.getLocation());
        destination.setLatitude(destinationRequest.getLatitude());
        destination.setLongitude(destinationRequest.getLongitude());
        destination.setImage(destinationRequest.getImage());
        destination.setTag(destinationRequest.getTag());
        Destination savedDest = destinationRepository.save(destination);
        return ResponseEntity.ok(savedDest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDestination(@PathVariable Long id) {
        Destination destination = destinationRepository.findById(id).orElse(null);
        if (destination == null) {
            return ResponseEntity.notFound().build();
        }
        destinationRepository.delete(destination);
        return ResponseEntity.ok(new MessageResponse("Destination deleted successfully!"));
    }
}
