package com.tripnest.config;

import com.tripnest.entity.Destination;
import com.tripnest.entity.Role;
import com.tripnest.repository.DestinationRepository;
import com.tripnest.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class DataInitializer {
    private final RoleRepository roleRepository;
    private final DestinationRepository destinationRepository;

    public DataInitializer(RoleRepository roleRepository, DestinationRepository destinationRepository) {
        this.roleRepository = roleRepository;
        this.destinationRepository = destinationRepository;
    }

    @Bean
    CommandLineRunner loadData() {
        return args -> {
            initializeRoles();
            initializeDestinations();
        };
    }

    @Transactional
    void initializeRoles() {
        if (roleRepository.findByName("USER").isEmpty())
            roleRepository.save(new Role("USER", "Standard user role"));
        if (roleRepository.findByName("ADMIN").isEmpty())
            roleRepository.save(new Role("ADMIN", "Administrator role"));
    }

    @Transactional
    void initializeDestinations() {
        add("Bali", "Indonesia", "Asia",
                "Slow mornings, warm water, and a beautiful balance of wellness, culture, and coast.",
                "April to October", "5-8 days", "₹65,000 - ₹1,10,000",
                "Ubud Rice Terraces|Uluwatu Temple|Seminyak Beach|Canggu Cafes", "sunset");

        add("Kyoto", "Japan", "Asia",
                "A thoughtful escape for gardens, temples, quiet lanes, and remarkable seasonal food.",
                "March to May or October to November", "4-6 days", "₹1,20,000 - ₹2,00,000",
                "Fushimi Inari|Arashiyama Bamboo Grove|Gion|Nishiki Market", "plum");

        add("Lisbon", "Portugal", "Europe",
                "A sunlit city break packed with tiled streets, viewpoints, and Atlantic energy.",
                "March to June or September to October", "4-6 days", "₹1,30,000 - ₹2,10,000",
                "Alfama|Belem Tower|Tram 28|LX Factory", "coral");

        add("Reykjavik", "Iceland", "Europe",
                "An ideal gateway to dramatic coastlines, geothermal pools, and wide-open skies.",
                "June to August or September to March", "4-8 days", "₹2,20,000 - ₹3,50,000",
                "Blue Lagoon|Golden Circle|Hallgrimskirkja|Harbor Walk", "aurora");

        add("Singapore", "Singapore", "Asia",
                "A seamless city escape for design, gardens, vibrant food, and family-friendly days.",
                "February to April", "3-5 days", "₹70,000 - ₹1,30,000",
                "Gardens by the Bay|Marina Bay|Sentosa|Hawker Centres", "ocean");

        add("New York", "United States", "North America",
                "An always-on city for iconic walks, culture, restaurants, and unforgettable evenings.",
                "April to June or September to November", "4-7 days", "₹2,00,000 - ₹3,50,000",
                "Central Park|Brooklyn Bridge|The Met|Broadway", "midnight");

        add("Cape Town", "South Africa", "Africa",
                "Mountains, ocean drives, vineyards, and a creative food scene in one striking city.",
                "November to March", "5-7 days", "₹1,10,000 - ₹1,80,000",
                "Table Mountain|Cape Point|Boulders Beach|Bo-Kaap", "ocean");

        add("Dubai", "United Arab Emirates", "Middle East",
                "A high-energy escape for architecture, desert adventures, beach clubs, and dining.",
                "November to March", "3-5 days", "₹70,000 - ₹1,30,000",
                "Burj Khalifa|Dubai Marina|Desert Safari|Al Fahidi", "sunset");

        add("Paris", "France", "Europe",
                "A classic city escape for art, slow cafe mornings, iconic streets, and evening lights.",
                "April to June or September to October", "4-6 days", "₹1,50,000 - ₹2,40,000",
                "Eiffel Tower|Louvre|Montmartre|Seine River", "coral");

        add("Rome", "Italy", "Europe", "Ancient landmarks, expressive neighbourhoods, and meals worth lingering over.",
                "April to June or September to October", "4-6 days", "₹1,40,000 - ₹2,20,000",
                "Colosseum|Trevi Fountain|Trastevere|Vatican City", "coral");

        add("Sydney", "Australia", "Oceania",
                "A harbour city made for coastal walks, lively neighborhoods, and long sunny days.",
                "September to November or March to May", "5-7 days", "₹1,70,000 - ₹2,80,000",
                "Opera House|Bondi Beach|Harbour Bridge|The Rocks", "ocean");

        add("Bangkok", "Thailand", "Asia",
                "A vibrant, sensory city for street food, temples, markets, and river evenings.",
                "November to February", "3-5 days", "₹45,000 - ₹80,000",
                "Grand Palace|Wat Arun|Chinatown|Chatuchak Market", "sunset");

        add("Marrakech", "Morocco", "Africa",
                "A colourful city break filled with riads, souks, gardens, and desert day trips.",
                "March to May or September to November", "3-5 days", "₹1,10,000 - ₹1,80,000",
                "Jemaa el-Fnaa|Majorelle Garden|Medina|Atlas Mountains", "sunset");

        add("Vancouver", "Canada", "North America",
                "A calm, outdoorsy city where mountain trails and waterfront neighborhoods meet.", "May to September",
                "4-6 days", "₹1,80,000 - ₹3,00,000", "Stanley Park|Granville Island|Grouse Mountain|Gastown", "aurora");
    }

    private void add(String name, String country, String region, String summary, String bestTime, String days,
            String budget, String attractions, String color) {
        if (destinationRepository.existsByNameIgnoreCase(name))
            return;
        Destination destination = new Destination();
        destination.setName(name);
        destination.setCountry(country);
        destination.setRegion(region);
        destination.setSummary(summary);
        destination.setBestTime(bestTime);
        destination.setRecommendedDays(days);
        destination.setBudgetRange(budget);
        destination.setAttractions(attractions);
        destination.setColor(color);
        destinationRepository.save(destination);
    }
}
