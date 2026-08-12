package com.tripnest.config;

import com.tripnest.entity.Attraction;
import com.tripnest.entity.Destination;
import com.tripnest.repository.AttractionRepository;
import com.tripnest.repository.DestinationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final DestinationRepository destinationRepository;
    private final AttractionRepository attractionRepository;

    @Override
    public void run(String... args) throws Exception {
        if (destinationRepository.count() > 0) {
            log.info("Destinations already present in database. Skipping initialization.");
            return;
        }

        log.info("Seeding initial destination data...");

        Destination ooty = Destination.builder()
                .name("Ooty")
                .country("India")
                .description("Queen of Hill Stations located in the Nilgiri Hills of Tamil Nadu.")
                .image("https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80")
                .rating(4.8)
                .popular(true)
                .popularTag("Hill Station")
                .build();

        Destination paris = Destination.builder()
                .name("Paris")
                .country("France")
                .description("City of Light, famous for its art, gastronomy, culture, and iconic landmarks.")
                .image("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80")
                .rating(4.9)
                .popular(true)
                .popularTag("City")
                .build();

        Destination tokyo = Destination.builder()
                .name("Tokyo")
                .country("Japan")
                .description("Japan’s bustling capital, mixing ultra-modern skyscrapers with historic temples.")
                .image("https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80")
                .rating(4.9)
                .popular(true)
                .popularTag("Metropolis")
                .build();

        Destination bali = Destination.builder()
                .name("Bali")
                .country("Indonesia")
                .description("Tropical paradise known for its forested volcanic mountains, rice paddies, and beaches.")
                .image("https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80")
                .rating(4.7)
                .popular(true)
                .popularTag("Beach & Resort")
                .build();

        Destination goa = Destination.builder()
                .name("Goa")
                .country("India")
                .description("Famous for its beaches, vibrant nightlife, Portuguese heritage, and seafood.")
                .image("https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80")
                .rating(4.6)
                .popular(true)
                .popularTag("Beach")
                .build();

        Destination dubai = Destination.builder()
                .name("Dubai")
                .country("UAE")
                .description("Futuristic desert metropolis known for luxury shopping, skyscrapers, and desert safaris.")
                .image("https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80")
                .rating(4.9)
                .popular(true)
                .popularTag("Luxury")
                .build();

        Destination reykjavik = Destination.builder()
                .name("Reykjavik")
                .country("Iceland")
                .description("Gateway to Northern Lights, geothermal hot springs, black sand beaches, and geysers.")
                .image("https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80")
                .rating(4.9)
                .popular(true)
                .popularTag("Wonders")
                .build();

        Destination manali = Destination.builder()
                .name("Manali")
                .country("India")
                .description("High-altitude Himalayan resort town ideal for skiing, paragliding, and mountain views.")
                .image("https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80")
                .rating(4.7)
                .popular(true)
                .popularTag("Adventure")
                .build();

        Destination nyc = Destination.builder()
                .name("New York City")
                .country("USA")
                .description("The city that never sleeps! Times Square, Central Park, Broadway, and iconic skyline.")
                .image("https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80")
                .rating(4.8)
                .popular(true)
                .popularTag("Metropolis")
                .build();

        Destination cairo = Destination.builder()
                .name("Cairo")
                .country("Egypt")
                .description("Sprawling capital set on the Nile River, home to the Great Pyramids of Giza and Sphinx.")
                .image("https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80")
                .rating(4.7)
                .popular(true)
                .popularTag("Ancient")
                .build();

        Destination phuket = Destination.builder()
                .name("Phuket")
                .country("Thailand")
                .description("Tropical Thai island featuring white sand beaches, limestone cliffs, and Phi Phi island tours.")
                .image("https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80")
                .rating(4.8)
                .popular(true)
                .popularTag("Beach & Resort")
                .build();

        Destination venice = Destination.builder()
                .name("Venice")
                .country("Italy")
                .description("Romantic Italian city built on 100+ lagoon islands, canals, gondolas, and palaces.")
                .image("https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=800&q=80")
                .rating(4.9)
                .popular(true)
                .popularTag("Romantic")
                .build();

        destinationRepository.saveAll(List.of(ooty, paris, tokyo, bali, goa, dubai, reykjavik, manali, nyc, cairo, phuket, venice));

        // Seed Attractions
        attractionRepository.saveAll(List.of(
                Attraction.builder()
                        .name("Ooty Botanical Gardens")
                        .description("Lush 55-acre garden featuring thousands of plant species and a fossilized tree trunk.")
                        .image("https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80")
                        .destination(ooty)
                        .build(),
                Attraction.builder()
                        .name("Nilgiri Mountain Railway")
                        .description("UNESCO World Heritage toy train offering breathtaking views of tea gardens.")
                        .image("https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80")
                        .destination(ooty)
                        .build(),
                Attraction.builder()
                        .name("Eiffel Tower")
                        .description("Iconic 19th-century wrought-iron lattice tower on the Champ de Mars.")
                        .image("https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80")
                        .destination(paris)
                        .build(),
                Attraction.builder()
                        .name("Louvre Museum")
                        .description("World's largest art museum and historic monument in Paris.")
                        .image("https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80")
                        .destination(paris)
                        .build(),
                Attraction.builder()
                        .name("Senso-ji Temple")
                        .description("Tokyo's oldest buddhist temple located in Asakusa.")
                        .image("https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80")
                        .destination(tokyo)
                        .build()
        ));

        log.info("Destination data successfully initialized!");
    }
}
