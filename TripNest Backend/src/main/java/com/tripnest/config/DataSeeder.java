package com.tripnest.config;

import com.tripnest.entity.Attraction;
import com.tripnest.entity.Destination;
import com.tripnest.repository.AttractionRepository;
import com.tripnest.repository.DestinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

// Seeds a handful of sample destinations/attractions on first boot so the
// Destinations pages have real content to render. Safe to remove once an
// admin content-management flow exists; only runs when the table is empty.
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final DestinationRepository destinationRepository;
    private final AttractionRepository attractionRepository;

    @Override
    public void run(String... args) {
        if (destinationRepository.count() > 0) {
            return;
        }

        seed("Bali", "Indonesia",
                "An island of terraced rice paddies, volcanic peaks, and laid-back beach towns.",
                "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
                "Best visited May–September for dry, sunny weather. Rent a scooter to explore Ubud's rice terraces, and budget a few days for temple-hopping.",
                "Trending", 4.7, true,
                List.of(
                        new String[]{"Tanah Lot Temple", "A sea temple perched on a rock formation, famous for sunset views."},
                        new String[]{"Tegallalang Rice Terraces", "Iconic stepped paddies just outside Ubud."},
                        new String[]{"Uluwatu Cliff", "Clifftop temple with Kecak fire dance performances at dusk."}
                ));

        seed("Paris", "France",
                "The City of Light, known for iconic landmarks, world-class museums, and café culture.",
                "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
                "Spring and early autumn offer mild weather and thinner crowds. Book the Louvre and Eiffel Tower ahead of time.",
                "Popular", 4.8, true,
                List.of(
                        new String[]{"Eiffel Tower", "The 330m iron landmark overlooking the Champ de Mars."},
                        new String[]{"Louvre Museum", "Home to the Mona Lisa and thousands of other works."},
                        new String[]{"Montmartre", "Hilltop artists' quarter crowned by Sacré-Cœur Basilica."}
                ));

        seed("Tokyo", "Japan",
                "A dazzling mix of ultramodern skyscrapers, historic temples, and legendary food culture.",
                "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
                "Visit in spring for cherry blossoms or autumn for foliage. The subway system is extensive; get a prepaid IC card.",
                "Trending", 4.9, true,
                List.of(
                        new String[]{"Senso-ji Temple", "Tokyo's oldest temple in the historic Asakusa district."},
                        new String[]{"Shibuya Crossing", "The world's busiest pedestrian scramble crossing."},
                        new String[]{"Meiji Shrine", "A tranquil forested shrine near bustling Harajuku."}
                ));

        seed("Goa", "India",
                "Sun-soaked beaches, Portuguese-era churches, and a relaxed coastal vibe.",
                "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
                "Peak season runs November–February. North Goa is livelier; South Goa is quieter and more upscale.",
                "Popular", 4.5, true,
                List.of(
                        new String[]{"Baga Beach", "A lively beach known for water sports and beach shacks."},
                        new String[]{"Basilica of Bom Jesus", "A UNESCO World Heritage church in Old Goa."},
                        new String[]{"Dudhsagar Falls", "A four-tiered waterfall deep in the Western Ghats."}
                ));

        seed("Santorini", "Greece",
                "Whitewashed cliffside villages overlooking the deep blue Aegean Sea.",
                "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1200&q=80",
                "Best visited April–June or September–October to avoid peak crowds and high summer prices.",
                null, 4.8, false,
                List.of(
                        new String[]{"Oia Village", "Famous for the most photographed sunset in the Cyclades."},
                        new String[]{"Fira", "The clifftop capital with cable cars down to the old port."}
                ));

        seed("New York City", "USA",
                "An endless skyline of icons — from Central Park to Times Square to the Statue of Liberty.",
                "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
                "Fall brings crisp weather and great light for photos. Get a MetroCard and expect to walk a lot.",
                null, 4.6, false,
                List.of(
                        new String[]{"Central Park", "An 843-acre green escape in the middle of Manhattan."},
                        new String[]{"Statue of Liberty", "The iconic copper statue on Liberty Island."}
                ));
    }

    private void seed(String name, String country, String description, String image,
                      String travelGuide, String popularTag, Double rating, boolean popular,
                      List<String[]> attractions) {

        Destination destination = destinationRepository.save(Destination.builder()
                .name(name)
                .country(country)
                .description(description)
                .image(image)
                .travelGuide(travelGuide)
                .popularTag(popularTag)
                .rating(rating)
                .popular(popular)
                .build());

        for (String[] attraction : attractions) {
            attractionRepository.save(Attraction.builder()
                    .name(attraction[0])
                    .description(attraction[1])
                    .destination(destination)
                    .build());
        }
    }
}
