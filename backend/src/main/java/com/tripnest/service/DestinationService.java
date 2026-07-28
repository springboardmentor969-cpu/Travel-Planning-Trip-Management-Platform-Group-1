package com.tripnest.service;

import com.tripnest.dto.DestinationDto;
import com.tripnest.entity.Destination;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.repository.DestinationRepository;
import java.util.Arrays;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DestinationService {
    private final DestinationRepository repository;
    public DestinationService(DestinationRepository repository) { this.repository = repository; }

    @Transactional(readOnly = true)
    public List<DestinationDto> list(String query, String region) {
        List<Destination> results = query != null && !query.isBlank()
                ? repository.findByNameContainingIgnoreCaseOrCountryContainingIgnoreCaseOrderByNameAsc(query.trim(), query.trim())
                : region != null && !region.isBlank() && !"All".equalsIgnoreCase(region)
                    ? repository.findByRegionIgnoreCaseOrderByNameAsc(region.trim())
                    : repository.findAll().stream().sorted((a, b) -> a.getName().compareToIgnoreCase(b.getName())).toList();
        return results.stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public DestinationDto get(Long id) { return toDto(find(id)); }
    public DestinationDto create(DestinationDto dto) { Destination entity = new Destination(); update(entity, dto); return toDto(repository.save(entity)); }
    public DestinationDto update(Long id, DestinationDto dto) { Destination entity = find(id); update(entity, dto); return toDto(repository.save(entity)); }
    public void delete(Long id) { repository.delete(find(id)); }

    private Destination find(Long id) { return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Destination not found with id " + id)); }
    private void update(Destination entity, DestinationDto dto) {
        entity.setName(dto.name()); entity.setCountry(dto.country()); entity.setRegion(dto.region()); entity.setSummary(dto.summary());
        entity.setBestTime(dto.bestTime()); entity.setRecommendedDays(dto.recommendedDays()); entity.setBudgetRange(dto.budgetRange());
        entity.setAttractions(String.join("|", dto.attractions() == null ? List.of() : dto.attractions())); entity.setColor(dto.color() == null ? "ocean" : dto.color());
    }
    private DestinationDto toDto(Destination entity) {
        List<String> attractions = entity.getAttractions() == null || entity.getAttractions().isBlank() ? List.of() : Arrays.stream(entity.getAttractions().split("\\|\\s*")).filter(s -> !s.isBlank()).toList();
        return new DestinationDto(entity.getId(), entity.getName(), entity.getCountry(), entity.getRegion(), entity.getSummary(), entity.getBestTime(), entity.getRecommendedDays(), entity.getBudgetRange(), attractions, entity.getColor());
    }
}
