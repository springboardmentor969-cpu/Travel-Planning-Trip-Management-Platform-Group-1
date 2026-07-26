package com.tripnest.service;

import com.tripnest.dto.AttractionResponse;
import com.tripnest.dto.DestinationResponse;
import com.tripnest.dto.WeatherResponse;
import com.tripnest.entity.Destination;
import com.tripnest.entity.FavoriteDestination;
import com.tripnest.entity.User;
import com.tripnest.exception.ApiException;
import com.tripnest.repository.AttractionRepository;
import com.tripnest.repository.DestinationRepository;
import com.tripnest.repository.FavoriteDestinationRepository;
import com.tripnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DestinationService {

    private final DestinationRepository destinationRepository;
    private final AttractionRepository attractionRepository;
    private final FavoriteDestinationRepository favoriteRepository;
    private final UserRepository userRepository;

    public List<DestinationResponse> getDestinations(Long userId, String search) {
        List<Destination> destinations = (search == null || search.isBlank())
                ? destinationRepository.findAll()
                : destinationRepository.findByNameContainingIgnoreCaseOrCountryContainingIgnoreCase(search, search);

        return destinations.stream()
                .map(d -> DestinationResponse.from(d, isFavorite(userId, d.getId())))
                .toList();
    }

    public List<DestinationResponse> getPopularDestinations(Long userId) {
        return destinationRepository.findByPopularTrueOrderByRatingDesc().stream()
                .map(d -> DestinationResponse.from(d, isFavorite(userId, d.getId())))
                .toList();
    }

    public DestinationResponse getDestinationById(Long userId, Long destinationId) {
        Destination destination = findDestination(destinationId);
        return DestinationResponse.from(destination, isFavorite(userId, destinationId));
    }

    public List<AttractionResponse> getAttractions(Long destinationId) {
        findDestination(destinationId);
        return attractionRepository.findByDestinationId(destinationId).stream()
                .map(AttractionResponse::from)
                .toList();
    }

    // Placeholder weather feed: deterministic mock data based on destination id,
    // so the UI has something realistic to render until a real weather API key is wired in.
    public WeatherResponse getWeather(Long destinationId) {
        Destination destination = findDestination(destinationId);
        String[] conditions = {"Sunny", "Partly cloudy", "Clear skies", "Light breeze", "Warm & humid"};
        int seed = Math.abs(destination.getName().hashCode());
        int temp = 20 + (seed % 14);
        String condition = conditions[seed % conditions.length];

        return WeatherResponse.builder()
                .current(WeatherResponse.CurrentWeather.builder()
                        .temp(temp)
                        .condition(condition)
                        .build())
                .build();
    }

    public List<DestinationResponse> getFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId).stream()
                .map(fav -> DestinationResponse.from(fav.getDestination(), true))
                .toList();
    }

    @Transactional
    public DestinationResponse addFavorite(Long userId, Long destinationId) {
        Destination destination = findDestination(destinationId);

        if (favoriteRepository.existsByUserIdAndDestinationId(userId, destinationId)) {
            return DestinationResponse.from(destination, true);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found."));

        favoriteRepository.save(FavoriteDestination.builder()
                .user(user)
                .destination(destination)
                .build());

        return DestinationResponse.from(destination, true);
    }

    @Transactional
    public void removeFavorite(Long userId, Long destinationId) {
        favoriteRepository.deleteByUserIdAndDestinationId(userId, destinationId);
    }

    private boolean isFavorite(Long userId, Long destinationId) {
        return userId != null && favoriteRepository.existsByUserIdAndDestinationId(userId, destinationId);
    }

    private Destination findDestination(Long destinationId) {
        return destinationRepository.findById(destinationId)
                .orElseThrow(() -> ApiException.notFound("Destination not found."));
    }
}