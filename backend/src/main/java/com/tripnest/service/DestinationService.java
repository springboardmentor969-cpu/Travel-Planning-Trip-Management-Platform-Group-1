package com.tripnest.service;

import com.tripnest.dto.DestinationDTO;
import com.tripnest.entity.Destination;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.repository.DestinationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;

    public DestinationService(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    @Transactional(readOnly = true)
    public List<DestinationDTO> getAllDestinations(String query, String category) {
        List<Destination> list;
        if (StringUtils.hasText(query)) {
            list = destinationRepository.searchDestinations(query.trim());
        } else if (StringUtils.hasText(category) && !"ALL".equalsIgnoreCase(category)) {
            list = destinationRepository.findByCategoryIgnoreCase(category.trim());
        } else {
            list = destinationRepository.findAll();
        }
        return list.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DestinationDTO> getPopularDestinations() {
        return destinationRepository.findByIsPopularTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DestinationDTO getDestinationById(Long id) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination", "id", id));
        return mapToDTO(destination);
    }

    @Transactional
    public DestinationDTO createDestination(DestinationDTO dto) {
        Destination destination = new Destination();
        destination.setName(dto.getName());
        destination.setCountry(dto.getCountry());
        destination.setCity(dto.getCity());
        destination.setDescription(dto.getDescription());
        destination.setImageUrl(dto.getImageUrl());
        destination.setCategory(dto.getCategory());
        destination.setBestTimeToVisit(dto.getBestTimeToVisit());
        destination.setAvgDailyBudget(dto.getAvgDailyBudget() != null ? dto.getAvgDailyBudget() : 100.0);
        destination.setLatitude(dto.getLatitude());
        destination.setLongitude(dto.getLongitude());
        destination.setRating(dto.getRating() != null ? dto.getRating() : 4.8);
        destination.setPopular(dto.isPopular());
        destination.setTopAttractions(dto.getTopAttractions());

        return mapToDTO(destinationRepository.save(destination));
    }

    @Transactional
    public DestinationDTO updateDestination(Long id, DestinationDTO dto) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination", "id", id));

        destination.setName(dto.getName());
        destination.setCountry(dto.getCountry());
        destination.setCity(dto.getCity());
        destination.setDescription(dto.getDescription());
        if (dto.getImageUrl() != null) destination.setImageUrl(dto.getImageUrl());
        destination.setCategory(dto.getCategory());
        destination.setBestTimeToVisit(dto.getBestTimeToVisit());
        if (dto.getAvgDailyBudget() != null) destination.setAvgDailyBudget(dto.getAvgDailyBudget());
        if (dto.getLatitude() != null) destination.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null) destination.setLongitude(dto.getLongitude());
        if (dto.getRating() != null) destination.setRating(dto.getRating());
        destination.setPopular(dto.isPopular());
        destination.setTopAttractions(dto.getTopAttractions());

        return mapToDTO(destinationRepository.save(destination));
    }

    @Transactional
    public void deleteDestination(Long id) {
        if (!destinationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Destination", "id", id);
        }
        destinationRepository.deleteById(id);
    }

    public DestinationDTO mapToDTO(Destination d) {
        DestinationDTO dto = new DestinationDTO();
        dto.setId(d.getId());
        dto.setName(d.getName());
        dto.setCountry(d.getCountry());
        dto.setCity(d.getCity());
        dto.setDescription(d.getDescription());
        dto.setImageUrl(d.getImageUrl());
        dto.setCategory(d.getCategory());
        dto.setBestTimeToVisit(d.getBestTimeToVisit());
        dto.setAvgDailyBudget(d.getAvgDailyBudget());
        dto.setLatitude(d.getLatitude());
        dto.setLongitude(d.getLongitude());
        dto.setRating(d.getRating());
        dto.setPopular(d.isPopular());
        dto.setTopAttractions(d.getTopAttractions());
        return dto;
    }
}
