package com.tripnest.service;

import com.tripnest.dto.ItineraryDto;
import com.tripnest.entity.Itinerary;
import com.tripnest.entity.Trip;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.mapper.ItineraryMapper;
import com.tripnest.repository.ItineraryRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ItineraryService {
    private final ItineraryRepository itineraryRepository;
    private final TripService tripService;

    public ItineraryService(ItineraryRepository itineraryRepository, TripService tripService) {
        this.itineraryRepository = itineraryRepository;
        this.tripService = tripService;
    }

    public ItineraryDto create(Long tripId, ItineraryDto dto) {
        Trip trip = tripService.findEditableEntity(tripId);
        Itinerary itinerary = new Itinerary();
        ItineraryMapper.updateEntity(itinerary, dto);
        itinerary.setTrip(trip);
        return ItineraryMapper.toDto(itineraryRepository.save(itinerary));
    }

    @Transactional(readOnly = true)
    public List<ItineraryDto> list(Long tripId) {
        tripService.findAccessibleEntity(tripId);
        return itineraryRepository.findByTripIdOrderByDayNumberAscIdAsc(tripId).stream()
                .map(ItineraryMapper::toDto)
                .toList();
    }

    public ItineraryDto update(Long tripId, Long itineraryId, ItineraryDto dto) {
        Itinerary itinerary = findOwned(tripId, itineraryId);
        ItineraryMapper.updateEntity(itinerary, dto);
        return ItineraryMapper.toDto(itineraryRepository.save(itinerary));
    }

    public void delete(Long tripId, Long itineraryId) {
        itineraryRepository.delete(findOwned(tripId, itineraryId));
    }

    private Itinerary findOwned(Long tripId, Long itineraryId) {
        tripService.findEditableEntity(tripId);
        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary item not found with id " + itineraryId));
        if (!itinerary.getTrip().getId().equals(tripId)) {
            throw new ResourceNotFoundException("Itinerary item does not belong to trip " + tripId);
        }
        return itinerary;
    }
}
