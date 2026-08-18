package com.tripnest.util;

import com.tripnest.entity.*;
import com.tripnest.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class SeedDataLoader implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(SeedDataLoader.class);

    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;
    private final TripRepository tripRepository;
    private final ItineraryRepository itineraryRepository;
    private final ActivityRepository activityRepository;
    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final NotificationRepository notificationRepository;
    private final TripMemberRepository tripMemberRepository;
    private final PasswordEncoder passwordEncoder;

    public SeedDataLoader(UserRepository userRepository,
                          DestinationRepository destinationRepository,
                          TripRepository tripRepository,
                          ItineraryRepository itineraryRepository,
                          ActivityRepository activityRepository,
                          BudgetRepository budgetRepository,
                          ExpenseRepository expenseRepository,
                          NotificationRepository notificationRepository,
                          TripMemberRepository tripMemberRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.destinationRepository = destinationRepository;
        this.tripRepository = tripRepository;
        this.itineraryRepository = itineraryRepository;
        this.activityRepository = activityRepository;
        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
        this.notificationRepository = notificationRepository;
        this.tripMemberRepository = tripMemberRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedUsersAndTripsIfEmpty();
        seedGlobalDestinationsCatalog();
    }

    private void seedUsersAndTripsIfEmpty() {
        if (userRepository.count() > 0) {
            return;
        }

        logger.info("Seeding initial TripNest users, trips, and sample itineraries...");

        // 1. Create Default Users
        User admin = new User("admin@tripnest.com", passwordEncoder.encode("admin123"), "Alex Reynolds (Admin)", Role.ROLE_ADMIN);
        admin.setBio("TripNest Platform Administrator & Global Travel Enthusiast.");
        admin.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80");
        admin.setTravelPreferences("Luxury, Cultural, Photography");
        userRepository.save(admin);

        User traveler = new User("traveler@tripnest.com", passwordEncoder.encode("traveler123"), "Maya Lin", Role.ROLE_TRAVELER);
        traveler.setBio("Solo explorer, foodie, and landscape photographer.");
        traveler.setAvatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80");
        traveler.setTravelPreferences("Adventure, Beach, Gastronomy");
        userRepository.save(traveler);

        User groupAdmin = new User("sarah@tripnest.com", passwordEncoder.encode("sarah123"), "Sarah Jenkins", Role.ROLE_GROUP_ADMIN);
        groupAdmin.setBio("Group travel organizer & outdoor enthusiast.");
        groupAdmin.setAvatarUrl("https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80");
        groupAdmin.setTravelPreferences("Hiking, Mountains, Group Trips");
        userRepository.save(groupAdmin);

        User friend = new User("david@tripnest.com", passwordEncoder.encode("david123"), "David Kim", Role.ROLE_TRAVELER);
        friend.setBio("Digital nomad & coffee lover.");
        friend.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80");
        userRepository.save(friend);

        // Sample Trips for Maya (Traveler)
        LocalDate start1 = LocalDate.now().plusDays(10);
        LocalDate end1 = start1.plusDays(4);

        Trip tripParis = new Trip();
        tripParis.setTitle("Autumn in Paris & Loire Valley");
        tripParis.setDescription("Exploring iconic museums, French patisseries, and picturesque Parisian architecture.");
        tripParis.setDestination("Paris, France");
        tripParis.setCoverImageUrl("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80");
        tripParis.setStartDate(start1);
        tripParis.setEndDate(end1);
        tripParis.setTotalBudget(1800.0);
        tripParis.setStatus(Trip.TripStatus.PLANNED);
        tripParis.setVisibility(Trip.TripVisibility.SHARED);
        tripParis.setOwner(traveler);
        Trip savedParis = tripRepository.save(tripParis);

        // Budget for Paris
        Budget bParis = new Budget(savedParis, 1800.0);
        bParis.setHotelBudget(700.0);
        bParis.setTransportationBudget(400.0);
        bParis.setFoodBudget(450.0);
        bParis.setShoppingBudget(150.0);
        bParis.setEntertainmentBudget(100.0);
        budgetRepository.save(bParis);

        // Members for Paris
        tripMemberRepository.save(new TripMember(savedParis, traveler, TripMember.GroupRole.GROUP_ADMIN, TripMember.InviteStatus.ACCEPTED));
        tripMemberRepository.save(new TripMember(savedParis, friend, TripMember.GroupRole.MEMBER, TripMember.InviteStatus.ACCEPTED));

        // Itineraries and activities for Paris
        Itinerary day1 = new Itinerary(savedParis, 1, start1, "Arrival & Eiffel Tower Magic", "Check-in and evening Seine cruise");
        itineraryRepository.save(day1);

        Activity act1 = new Activity();
        act1.setItinerary(day1);
        act1.setTitle("Check into Hotel Le Marais");
        act1.setActivityType(Activity.ActivityType.ACCOMMODATION);
        act1.setStartTime(LocalTime.of(14, 0));
        act1.setDurationMinutes(60);
        act1.setLocationName("Le Marais, Paris");
        act1.setEstimatedCost(220.0);
        act1.setActualCost(220.0);
        act1.setNotes("Confirmation booking #FR-88912");
        act1.setSequenceOrder(1);
        activityRepository.save(act1);

        Activity act2 = new Activity();
        act2.setItinerary(day1);
        act2.setTitle("Sunset Eiffel Tower Visit & Seine River Cruise");
        act2.setActivityType(Activity.ActivityType.SIGHTSEEING);
        act2.setStartTime(LocalTime.of(17, 30));
        act2.setDurationMinutes(120);
        act2.setLocationName("Champ de Mars, 5 Av. Anatole France, 75007 Paris");
        act2.setEstimatedCost(45.0);
        act2.setActualCost(45.0);
        act2.setSequenceOrder(2);
        act2.setReminderSet(true);
        activityRepository.save(act2);

        Itinerary day2 = new Itinerary(savedParis, 2, start1.plusDays(1), "Art & Gastronomy Exploration", "Louvre Museum and Latin Quarter");
        itineraryRepository.save(day2);

        Activity act3 = new Activity();
        act3.setItinerary(day2);
        act3.setTitle("Morning Guided Tour of the Louvre");
        act3.setActivityType(Activity.ActivityType.SIGHTSEEING);
        act3.setStartTime(LocalTime.of(9, 30));
        act3.setDurationMinutes(180);
        act3.setLocationName("Musée du Louvre, 75001 Paris");
        act3.setEstimatedCost(35.0);
        act3.setActualCost(35.0);
        act3.setSequenceOrder(1);
        activityRepository.save(act3);

        Activity act4 = new Activity();
        act4.setItinerary(day2);
        act4.setTitle("Classic French Bistro Lunch");
        act4.setActivityType(Activity.ActivityType.DINING);
        act4.setStartTime(LocalTime.of(13, 0));
        act4.setDurationMinutes(90);
        act4.setLocationName("Bistrot Paul Bert");
        act4.setEstimatedCost(65.0);
        act4.setActualCost(60.0);
        act4.setSequenceOrder(2);
        activityRepository.save(act4);

        // Initial Expenses for Paris
        Expense exp1 = new Expense();
        exp1.setTrip(savedParis);
        exp1.setTitle("Flight Tickets Paris CDG");
        exp1.setAmount(380.0);
        exp1.setCategory(Expense.ExpenseCategory.TRANSPORTATION);
        exp1.setExpenseDate(LocalDate.now().minusDays(5));
        exp1.setPaidBy(traveler);
        exp1.setPaymentMethod("CREDIT_CARD");
        exp1.setNotes("Air France roundtrip flight reservation");
        expenseRepository.save(exp1);

        Expense exp2 = new Expense();
        exp2.setTrip(savedParis);
        exp2.setTitle("Hotel Deposit — Le Marais Boutique");
        exp2.setAmount(220.0);
        exp2.setCategory(Expense.ExpenseCategory.HOTEL);
        exp2.setExpenseDate(LocalDate.now().minusDays(2));
        exp2.setPaidBy(traveler);
        exp2.setPaymentMethod("CREDIT_CARD");
        expenseRepository.save(exp2);

        Expense exp3 = new Expense();
        exp3.setTrip(savedParis);
        exp3.setTitle("Louvre & Museum Pass Advance Tickets");
        exp3.setAmount(70.0);
        exp3.setCategory(Expense.ExpenseCategory.ENTERTAINMENT);
        exp3.setExpenseDate(LocalDate.now().minusDays(1));
        exp3.setPaidBy(friend);
        exp3.setPaymentMethod("UPI");
        expenseRepository.save(exp3);

        // Notifications
        notificationRepository.save(new Notification(
                traveler,
                "Welcome to TripNest!",
                "Get started by exploring popular destinations, building your day-wise itinerary, and inviting travel companions.",
                Notification.NotificationType.SYSTEM,
                "/destinations"
        ));

        notificationRepository.save(new Notification(
                traveler,
                "Upcoming Trip in 10 Days",
                "Your trip 'Autumn in Paris & Loire Valley' begins soon. Check your activities and document checklist.",
                Notification.NotificationType.TRIP_REMINDER,
                "/trips/" + savedParis.getId()
        ));
    }

    private void seedGlobalDestinationsCatalog() {
        List<Destination> catalog = getComprehensiveDestinations();
        int added = 0;
        for (Destination d : catalog) {
            if (!destinationRepository.existsByName(d.getName())) {
                destinationRepository.save(d);
                added++;
            }
        }
        logger.info("Destination Catalog check complete. {} new destinations synchronized.", added);
    }

    private List<Destination> getComprehensiveDestinations() {
        List<Destination> list = new ArrayList<>();

        // 1. France - Paris
        list.add(new Destination(
                "Paris", "France", "Paris",
                "The City of Light dazzles with iconic monuments like the Eiffel Tower, the Louvre museum, world-class bakeries, and romantic Seine river cruises.",
                "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80",
                "Cultural", "April - October", 180.0,
                48.8566, 2.3522, 4.9, true,
                "Eiffel Tower, Louvre Museum, Notre-Dame, Arc de Triomphe, Montmartre"
        ));

        // 2. France - French Riviera & Nice
        list.add(new Destination(
                "Nice & French Riviera", "France", "Nice",
                "Azure Mediterranean coastlines, glamorous seaside promenades, medieval hilltop villages like Èze, and luxury yacht harbors.",
                "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80",
                "Beach", "May - September", 195.0,
                43.7102, 7.2620, 4.85, false,
                "Promenade des Anglais, Monaco Day Tour, Old Town (Vieux Nice), Castle Hill"
        ));

        // 3. Japan - Kyoto
        list.add(new Destination(
                "Kyoto", "Japan", "Kyoto",
                "Experience a magical blend of centuries-old Shinto shrines, tranquil bamboo forests, traditional tea houses, and historic geisha districts.",
                "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
                "Historical", "March - May & Oct - Nov", 160.0,
                35.0116, 135.7681, 4.95, true,
                "Fushimi Inari Shrine, Arashiyama Bamboo Grove, Kinkaku-ji, Gion District"
        ));

        // 4. Japan - Tokyo
        list.add(new Destination(
                "Tokyo", "Japan", "Tokyo",
                "Futuristic skyscrapers, neon-lit Shibuya crossings, historic Asakusa temples, world-class culinary scene, and vibrant otaku culture.",
                "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
                "City", "Year-round", 175.0,
                35.6762, 139.6503, 4.92, true,
                "Shibuya Crossing, Senso-ji Temple, Tokyo Skytree, Shinjuku Gyoen, Akihabara"
        ));

        // 5. Indonesia - Bali
        list.add(new Destination(
                "Bali", "Indonesia", "Ubud & Seminyak",
                "Tropical paradise famous for emerald rice terraces, volcanic peaks, sacred sea temples, world-class surf breaks, and restorative wellness retreats.",
                "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80",
                "Beach", "May - September", 75.0,
                -8.4095, 115.1889, 4.85, true,
                "Ubud Monkey Forest, Tegallalang Rice Terraces, Uluwatu Temple, Tanah Lot"
        ));

        // 6. Switzerland - Swiss Alps
        list.add(new Destination(
                "Swiss Alps", "Switzerland", "Interlaken & Zermatt",
                "Majestic snow-capped alpine peaks, turquoise glacial lakes, charming chalets, scenic mountain trains, and premier skiing.",
                "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&auto=format&fit=crop&q=80",
                "Mountain", "June - September & Dec - March", 220.0,
                46.6863, 7.8632, 4.9, true,
                "Jungfraujoch, Matterhorn, Lake Brienz, Grindelwald First"
        ));

        // 7. Italy - Rome
        list.add(new Destination(
                "Rome", "Italy", "Rome",
                "An open-air museum rich in 3,000 years of globally influential art, architecture, ancient Colosseum history, and mouthwatering Italian cuisine.",
                "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80",
                "Historical", "April - June & Sept - Oct", 150.0,
                41.9028, 12.4964, 4.88, true,
                "Colosseum, Roman Forum, Trevi Fountain, Vatican City, Pantheon"
        ));

        // 8. Italy - Venice
        list.add(new Destination(
                "Venice", "Italy", "Venice",
                "The Floating City of labyrinthine romantic canals, ornate Gothic palazzos, gondola rides, and iconic Venetian glass art.",
                "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&auto=format&fit=crop&q=80",
                "Cultural", "April - June & Sept - Nov", 170.0,
                45.4408, 12.3155, 4.82, false,
                "St. Mark's Basilica, Grand Canal, Rialto Bridge, Doge's Palace, Burano Island"
        ));

        // 9. Italy - Amalfi Coast & Positano
        list.add(new Destination(
                "Amalfi Coast", "Italy", "Positano & Amalfi",
                "Dramatic cliffside pastel villages plunging into turquoise waters, fragrant lemon groves, and scenic Mediterranean vistas.",
                "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80",
                "Beach", "May - October", 210.0,
                40.6281, 14.4850, 4.93, true,
                "Positano Beach, Path of the Gods hike, Ravello Villa Rufolo, Capri Island Cruise"
        ));

        // 10. South Africa - Cape Town
        list.add(new Destination(
                "Cape Town", "South Africa", "Cape Town",
                "Where dramatic oceans meet towering Table Mountain. Offers wine tasting in Stellenbosch, penguin encounters at Boulders Beach, and scenic coastal drives.",
                "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&auto=format&fit=crop&q=80",
                "Adventure", "November - March", 95.0,
                -33.9249, 18.4241, 4.82, true,
                "Table Mountain Aerial Cableway, Cape Point, Boulders Beach, Kirstenbosch Gardens"
        ));

        // 11. USA - New York City
        list.add(new Destination(
                "New York City", "USA", "New York",
                "The city that never sleeps: Broadway theater, Times Square neon lights, Central Park strolls, and world-class dining.",
                "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=80",
                "City", "Year-round", 250.0,
                40.7128, -74.0060, 4.78, false,
                "Central Park, Empire State Building, Statue of Liberty, Brooklyn Bridge, Times Square"
        ));

        // 12. USA - Grand Canyon & Arizona
        list.add(new Destination(
                "Grand Canyon", "USA", "Flagstaff & Sedona",
                "One of the Seven Natural Wonders of the World, showcasing colossal red rock gorges carved by the Colorado River over millions of years.",
                "https://images.unsplash.com/photo-1615551043360-33de8b5f410c?w=800&auto=format&fit=crop&q=80",
                "Adventure", "March - May & Sept - Nov", 140.0,
                36.0544, -112.1401, 4.95, false,
                "South Rim Viewpoints, Horseshoe Bend, Antelope Canyon, Bright Angel Trail"
        ));

        // 13. USA - Hawaii (Maui & Oahu)
        list.add(new Destination(
                "Hawaii", "USA", "Maui & Honolulu",
                "Polynesian paradise featuring golden volcanic sand beaches, lush tropical rainforests, world-class surfing, and cascading waterfalls.",
                "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=800&auto=format&fit=crop&q=80",
                "Beach", "Year-round", 240.0,
                20.7984, -156.3319, 4.91, true,
                "Road to Hana, Haleakala Crater, Waikiki Beach, Na Pali Coast, Pearl Harbor"
        ));

        // 14. Egypt - Cairo & Giza
        list.add(new Destination(
                "Cairo & Giza", "Egypt", "Cairo",
                "Unravel timeless antiquities: Marvel at the Great Pyramids of Giza, the enigmatic Sphinx, and treasure-filled museums along the Nile.",
                "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&auto=format&fit=crop&q=80",
                "Historical", "October - April", 80.0,
                30.0444, 31.2357, 4.75, false,
                "Pyramids of Giza, Great Sphinx, Khan el-Khalili Bazaar, Egyptian Museum"
        ));

        // 15. United Kingdom - London
        list.add(new Destination(
                "London", "United Kingdom", "London",
                "Dynamic global capital blending royal heritage, world-renowned West End theater, iconic landmarks, and expansive royal parks.",
                "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80",
                "City", "May - September", 190.0,
                51.5074, -0.1278, 4.86, true,
                "Big Ben, London Eye, Tower Bridge, British Museum, Buckingham Palace"
        ));

        // 16. United Kingdom - Scottish Highlands & Edinburgh
        list.add(new Destination(
                "Scottish Highlands", "United Kingdom", "Edinburgh & Inverness",
                "Romantic ancient castles, mystical lochs, rugged mountain peaks, and rich Celtic folklore and history.",
                "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&auto=format&fit=crop&q=80",
                "Mountain", "May - September", 155.0,
                57.3229, -4.4244, 4.88, false,
                "Edinburgh Castle, Isle of Skye, Loch Ness, Glenfinnan Viaduct, Eilean Donan Castle"
        ));

        // 17. Spain - Barcelona
        list.add(new Destination(
                "Barcelona", "Spain", "Barcelona",
                "Antoni Gaudí’s surreal modernist architecture, vibrant tapas culture, Mediterranean sandy beaches, and lively Gothic Quarter streets.",
                "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&auto=format&fit=crop&q=80",
                "Cultural", "May - October", 145.0,
                41.3879, 2.1699, 4.89, true,
                "Sagrada Família, Park Güell, Casa Batlló, Gothic Quarter, Barceloneta Beach"
        ));

        // 18. Greece - Santorini
        list.add(new Destination(
                "Santorini", "Greece", "Oia & Fira",
                "Famous white-washed cliffside cubist villas, cobalt blue domes, volcanic caldera sunsets, and crystalline Aegean waters.",
                "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80",
                "Beach", "May - October", 200.0,
                36.3932, 25.4615, 4.96, true,
                "Oia Sunset Point, Red Beach, Ancient Thera, Akrotiri Ruins, Ammoudi Bay"
        ));

        // 19. Greece - Athens
        list.add(new Destination(
                "Athens", "Greece", "Athens",
                "The cradle of Western civilization and democracy, crowned by the majestic 5th-century BC Acropolis and vibrant Plaka alleyways.",
                "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&auto=format&fit=crop&q=80",
                "Historical", "April - June & Sept - Nov", 110.0,
                37.9838, 23.7275, 4.79, false,
                "Acropolis of Athens, Parthenon, Acropolis Museum, Plaka District, Temple of Olympian Zeus"
        ));

        // 20. Australia - Sydney
        list.add(new Destination(
                "Sydney", "Australia", "Sydney",
                "Stunning harbor jewel featuring the sail-shaped Opera House, iconic Harbour Bridge climbs, and sun-drenched golden surf beaches.",
                "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format&fit=crop&q=80",
                "City", "September - April", 185.0,
                -33.8688, 151.2093, 4.88, true,
                "Sydney Opera House, Bondi Beach, Sydney Harbour Bridge, Blue Mountains, Taronga Zoo"
        ));

        // 21. Australia - Great Barrier Reef & Cairns
        list.add(new Destination(
                "Great Barrier Reef", "Australia", "Cairns",
                "The world's largest coral reef system, hosting thousands of vibrant marine species, crystal-clear lagoons, and ancient tropical rainforests.",
                "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&auto=format&fit=crop&q=80",
                "Adventure", "June - October", 170.0,
                -16.9186, 145.7781, 4.92, false,
                "Outer Reef Scuba & Snorkeling, Daintree Rainforest, Kuranda Scenic Railway, Green Island"
        ));

        // 22. India - Agra & Taj Mahal
        list.add(new Destination(
                "Agra & Taj Mahal", "India", "Agra",
                "Home to the legendary Taj Mahal, an ivory-white marble mausoleum of eternal love and a UNESCO World Heritage wonder.",
                "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
                "Historical", "October - March", 65.0,
                27.1767, 78.0081, 4.94, true,
                "Taj Mahal, Agra Fort, Fatehpur Sikri, Mehtab Bagh, Itimad-ud-Daulah"
        ));

        // 23. India - Jaipur & Rajasthan
        list.add(new Destination(
                "Jaipur & Rajasthan", "India", "Jaipur",
                "The majestic 'Pink City' filled with grand maharaja palaces, hilltop fortresses, colorful bazaars, and rich Rajputana heritage.",
                "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
                "Cultural", "October - March", 70.0,
                26.9124, 75.7873, 4.87, false,
                "Hawa Mahal, Amber Palace, City Palace, Jal Mahal, Nahargarh Fort"
        ));

        // 24. India - Kerala Backwaters & Munnar
        list.add(new Destination(
                "Kerala", "India", "Alleppey & Munnar",
                "God's Own Country: Serene houseboat cruises along palm-fringed lagoons, sprawling emerald tea plantations, and Ayurvedic healing.",
                "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80",
                "Beach", "September - March", 60.0,
                9.4981, 76.3388, 4.86, false,
                "Alleppey Houseboat Cruise, Munnar Tea Gardens, Fort Kochi, Periyar Wildlife Sanctuary"
        ));

        // 25. Thailand - Bangkok
        list.add(new Destination(
                "Bangkok", "Thailand", "Bangkok",
                "Sprawling metropolis of ornate Buddhist golden temples, floating markets, mouth-watering street food stalls, and bustling night markets.",
                "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&auto=format&fit=crop&q=80",
                "City", "November - February", 75.0,
                13.7563, 100.5018, 4.84, true,
                "Grand Palace, Wat Arun, Wat Pho (Reclining Buddha), Chatuchak Market, Chao Phraya Cruise"
        ));

        // 26. Thailand - Phuket & Phi Phi Islands
        list.add(new Destination(
                "Phuket & Phi Phi", "Thailand", "Phuket",
                "Limestone karst islands rising from turquoise Andaman waters, vibrant nightlife, world-class diving, and soft white sand beaches.",
                "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&auto=format&fit=crop&q=80",
                "Beach", "November - April", 85.0,
                7.8804, 98.3923, 4.85, false,
                "Maya Bay, Big Buddha Phuket, James Bond Island, Patong Beach, Phi Phi Viewpoint"
        ));

        // 27. UAE - Dubai
        list.add(new Destination(
                "Dubai", "United Arab Emirates", "Dubai",
                "An ultra-modern oasis of architectural superlatives: Burj Khalifa, artificial Palm islands, luxury shopping malls, and thrilling desert safaris.",
                "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80",
                "City", "November - March", 210.0,
                25.2048, 55.2708, 4.89, true,
                "Burj Khalifa, Dubai Mall, Palm Jumeirah, Desert Dune Safari, Dubai Marina"
        ));

        // 28. Canada - Banff & Canadian Rockies
        list.add(new Destination(
                "Banff & Canadian Rockies", "Canada", "Banff & Jasper",
                "Glacial fed neon-cyan alpine lakes, towering Rocky Mountain peaks, hot springs, and abundant wildlife in Canada’s oldest national park.",
                "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&auto=format&fit=crop&q=80",
                "Mountain", "June - September & Dec - March", 185.0,
                51.1784, -115.5708, 4.96, true,
                "Lake Louise, Moraine Lake, Icefields Parkway, Banff Gondola, Johnston Canyon"
        ));

        // 29. Brazil - Rio de Janeiro
        list.add(new Destination(
                "Rio de Janeiro", "Brazil", "Rio de Janeiro",
                "The Marvelous City where samba rhythms, iconic Christ the Redeemer overlooking Sugarloaf Mountain, and legendary Copacabana sands come alive.",
                "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&auto=format&fit=crop&q=80",
                "Beach", "December - March", 95.0,
                -22.9068, -43.1729, 4.83, true,
                "Christ the Redeemer, Sugarloaf Mountain Cable Car, Copacabana, Ipanema Beach, Selarón Steps"
        ));

        // 30. Peru - Machu Picchu & Cusco
        list.add(new Destination(
                "Machu Picchu", "Peru", "Cusco & Aguas Calientes",
                "The mysterious 15th-century Inca citadel perched high in the Andean cloud forest, surrounded by breathtaking mountain terraces.",
                "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&auto=format&fit=crop&q=80",
                "Historical", "May - October", 120.0,
                -13.1631, -72.5450, 4.97, true,
                "Machu Picchu Citadel, Huayna Picchu, Sacred Valley of the Incas, Cusco Historic Center"
        ));

        // 31. Germany - Munich & Bavarian Alps
        list.add(new Destination(
                "Munich & Bavaria", "Germany", "Munich",
                "Fairy-tale castles like Neuschwanstein, world-renowned beer gardens, Alpine hiking trails, and centuries of Bavarian history.",
                "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=800&auto=format&fit=crop&q=80",
                "Cultural", "May - October", 150.0,
                48.1351, 11.5820, 4.81, false,
                "Neuschwanstein Castle, Marienplatz, English Garden, Nymphenburg Palace, Zugspitze"
        ));

        // 32. Iceland - Reykjavik & Golden Circle
        list.add(new Destination(
                "Reykjavik & Golden Circle", "Iceland", "Reykjavik",
                "The land of fire and ice: geothermal hot springs, roaring waterfalls, volcanic black sand beaches, and dancing Northern Lights.",
                "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&auto=format&fit=crop&q=80",
                "Adventure", "June - August & Sept - March", 230.0,
                64.1466, -21.9426, 4.91, true,
                "Blue Lagoon Geothermal Spa, Gullfoss Waterfall, Thingvellir National Park, Reynisfjara Black Beach"
        ));

        // 33. Mexico - Cancun & Riviera Maya
        list.add(new Destination(
                "Cancun & Riviera Maya", "Mexico", "Cancun & Tulum",
                "Pristine Caribbean turquoise waters, sacred Mayan ruins overlooking the sea, mystical underground cenotes, and vibrant eco-parks.",
                "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80",
                "Beach", "December - April", 130.0,
                21.1619, -86.8515, 4.86, false,
                "Chichén Itzá Pyramids, Tulum Ruins, Cenote Dos Ojos, Xcaret Eco Park, Isla Mujeres"
        ));

        // 34. Turkey - Istanbul & Cappadocia
        list.add(new Destination(
                "Istanbul & Cappadocia", "Turkey", "Istanbul & Goreme",
                "Where East meets West across the Bosphorus Strait, coupled with fairy-chimney landscapes and sunrise hot air balloon rides.",
                "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop&q=80",
                "Historical", "April - June & Sept - Nov", 90.0,
                41.0082, 28.9784, 4.93, true,
                "Hagia Sophia, Blue Mosque, Cappadocia Hot Air Balloons, Grand Bazaar, Topkapi Palace"
        ));

        // 35. New Zealand - Queenstown & South Island
        list.add(new Destination(
                "Queenstown & Fiordland", "New Zealand", "Queenstown",
                "The adventure capital of the world: majestic fjords of Milford Sound, adrenaline jet boating, bungee jumping, and stunning Lord of the Rings landscapes.",
                "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&auto=format&fit=crop&q=80",
                "Adventure", "December - March & June - August", 175.0,
                -45.0312, 168.6626, 4.94, true,
                "Milford Sound Cruise, Lake Wakatipu, Remarkables Mountain Range, Shotover Jet, Franz Josef Glacier"
        ));

        // 36. Portugal - Lisbon & Sintra
        list.add(new Destination(
                "Lisbon & Sintra", "Portugal", "Lisbon",
                "Sun-drenched coastal capital of historic yellow trams, soulful Fado music, pastel de nata pastries, and Sintra's magical Pena Palace.",
                "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=800&auto=format&fit=crop&q=80",
                "Cultural", "April - October", 125.0,
                38.7223, -9.1393, 4.87, false,
                "Belém Tower, Pena Palace Sintra, Tram 28, Castelo de São Jorge, Alfama District"
        ));

        // 37. Morocco - Marrakech & Sahara
        list.add(new Destination(
                "Marrakech & Sahara Desert", "Morocco", "Marrakech & Merzouga",
                "Sensory explosion of aromatic spice souks, terracotta riads, majestic Atlas mountain passes, and golden Sahara camel treks under star-filled skies.",
                "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&auto=format&fit=crop&q=80",
                "Cultural", "October - April", 85.0,
                31.6295, -7.9811, 4.88, true,
                "Jemaa el-Fnaa Square, Jardin Majorelle, Bahia Palace, Erg Chebbi Sahara Dunes, Ait Benhaddou"
        ));

        // 38. Singapore - Singapore
        list.add(new Destination(
                "Singapore", "Singapore", "Singapore",
                "A futuristic garden city boasting the iconic Marina Bay Sands infinity pool, towering Supertree Grove, and Michelin-starred hawker street foods.",
                "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&auto=format&fit=crop&q=80",
                "City", "Year-round", 190.0,
                1.3521, 103.8198, 4.9, true,
                "Marina Bay Sands, Gardens by the Bay, Sentosa Island, Jewel Changi, Chinatown Hawker Stalls"
        ));

        // 39. Norway - Western Fjords & Tromsø
        list.add(new Destination(
                "Norwegian Fjords", "Norway", "Bergen & Geiranger",
                "Dramatic glacially carved fjords, thundering waterfalls, the scenic Flåm mountain railway, and winter Aurora Borealis displays.",
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
                "Mountain", "June - August (Fjords) & Nov - Feb (Aurora)", 215.0,
                62.1008, 7.2059, 4.93, false,
                "Geirangerfjord Cruise, Flåm Railway, Bryggen Hanseatic Wharf, Tromsø Northern Lights"
        ));

        // 40. Netherlands - Amsterdam
        list.add(new Destination(
                "Amsterdam", "Netherlands", "Amsterdam",
                "Charming UNESCO canal ring network, world-renowned Van Gogh & Rembrandt art collections, cycling paths, and springtime tulip fields.",
                "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800&auto=format&fit=crop&q=80",
                "City", "April - September", 165.0,
                52.3676, 4.9041, 4.84, false,
                "Amsterdam Canal Cruise, Rijksmuseum, Van Gogh Museum, Anne Frank House, Keukenhof Gardens"
        ));

        // 41. Maldives - Coral Atolls
        list.add(new Destination(
                "Maldives", "Maldives", "North Malé Atoll",
                "Unmatched luxury and romance with private overwater bungalows, turquoise coral lagoons, and abundant manta ray and turtle diving.",
                "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop&q=80",
                "Beach", "November - April", 350.0,
                3.2028, 73.2207, 4.98, true,
                "Overwater Bungalow Stay, Coral Reef Snorkeling, Sunset Dolphin Cruise, Glowing Beach"
        ));

        // 42. Vietnam - Ha Long Bay & Hanoi
        list.add(new Destination(
                "Ha Long Bay & Hanoi", "Vietnam", "Hanoi & Ha Long",
                "Thousands of emerald limestone islands rising from tranquil waters, historic Hanoi Old Quarter street life, and flavorful Vietnamese cuisine.",
                "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80",
                "Adventure", "October - April", 55.0,
                20.9101, 107.1839, 4.86, false,
                "Ha Long Bay Overnight Cruise, Hanoi Old Quarter, Sung Sot Cave, Ninh Binh Boat Tour"
        ));

        return list;
    }
}
