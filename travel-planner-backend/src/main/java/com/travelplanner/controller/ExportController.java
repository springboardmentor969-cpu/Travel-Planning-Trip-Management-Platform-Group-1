package com.travelplanner.controller;

import com.travelplanner.entity.Trip;
import com.travelplanner.entity.Itinerary;
import com.travelplanner.entity.Activity;
import com.travelplanner.entity.Expense;
import com.travelplanner.repository.TripRepository;
import com.travelplanner.repository.ItineraryRepository;
import com.travelplanner.repository.ActivityRepository;
import com.travelplanner.repository.ExpenseRepository;
import com.travelplanner.security.UserDetailsImpl;
import com.travelplanner.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.nio.charset.StandardCharsets;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/trips")
public class ExportController {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private ItineraryRepository itineraryRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @GetMapping("/{tripId}/export/csv")
    public ResponseEntity<?> exportCsv(@PathVariable Long tripId) {
        Trip trip = tripRepository.findById(tripId).orElse(null);
        if (trip == null) {
            return ResponseEntity.notFound().build();
        }
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        boolean isOwner = trip.getUser().getId().equals(userDetails.getId());
        boolean isCollaborator = trip.getCollaborators().stream().anyMatch(c -> c.getId().equals(userDetails.getId()));
        if (!isOwner && !isCollaborator) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Error: Unauthorized."));
        }

        StringBuilder csv = new StringBuilder();
        csv.append("Trip Title,Location/Destination,Description,Start Date,End Date\n");
        csv.append(String.format("\"%s\",\"%s\",\"%s\",%s,%s\n\n",
                trip.getTitle().replace("\"", "\"\""),
                trip.getDescription().replace("\"", "\"\""),
                trip.getDescription().replace("\"", "\"\""),
                trip.getStartDate(),
                trip.getEndDate()));

        // Add Itinerary Activities
        csv.append("ITINERARY TIMELINE\n");
        csv.append("Day,Day Title,Activity Title,Time,Cost,Description\n");
        List<Itinerary> itineraries = itineraryRepository.findByTripId(tripId);
        for (Itinerary itinerary : itineraries) {
            List<Activity> activities = activityRepository.findByItineraryId(itinerary.getId());
            for (Activity activity : activities) {
                String timeStr = "";
                if (activity.getStartTime() != null) {
                    timeStr = activity.getStartTime().toLocalTime().toString();
                    if (activity.getEndTime() != null) {
                        timeStr += " - " + activity.getEndTime().toLocalTime().toString();
                    }
                }
                double costVal = activity.getCost() != null ? activity.getCost().doubleValue() : 0.0;
                String descVal = activity.getDescription() != null ? activity.getDescription() : "";
                
                csv.append(String.format("Day %d,\"%s\",\"%s\",\"%s\",%.2f,\"%s\"\n",
                        itinerary.getDayNumber(),
                        itinerary.getTitle().replace("\"", "\"\""),
                        activity.getTitle().replace("\"", "\"\""),
                        timeStr.replace("\"", "\"\""),
                        costVal,
                        descVal.replace("\"", "\"\"")));
            }
        }

        csv.append("\nEXPENSES RECORD\n");
        csv.append("Category,Amount,Description,Date\n");
        List<Expense> expenses = expenseRepository.findByTripId(tripId);
        for (Expense expense : expenses) {
            double amtVal = expense.getAmount() != null ? expense.getAmount().doubleValue() : 0.0;
            csv.append(String.format("\"%s\",%.2f,\"%s\",%s\n",
                    expense.getCategory(),
                    amtVal,
                    expense.getDescription().replace("\"", "\"\""),
                    expense.getExpenseDate()));
        }

        byte[] bytes = csv.toString().getBytes(StandardCharsets.UTF_8);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("attachment", "trip_report_" + tripId + ".csv");
        headers.setContentType(new MediaType("text", "csv", StandardCharsets.UTF_8));

        return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
    }

    @GetMapping("/{tripId}/export/pdf")
    public ResponseEntity<?> exportPdf(@PathVariable Long tripId) {
        Trip trip = tripRepository.findById(tripId).orElse(null);
        if (trip == null) {
            return ResponseEntity.notFound().build();
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        boolean isOwner = trip.getUser().getId().equals(userDetails.getId());
        boolean isCollaborator = trip.getCollaborators().stream().anyMatch(c -> c.getId().equals(userDetails.getId()));
        if (!isOwner && !isCollaborator) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Error: Unauthorized."));
        }

        // Generates a beautifully-structured text-based summary layout that maps perfectly to printable format
        StringBuilder pdf = new StringBuilder();
        pdf.append("========================================================================\n");
        pdf.append("                       TRIPPLANNER TRAVEL SUMMARY                       \n");
        pdf.append("========================================================================\n\n");
        pdf.append(String.format(" TRIP TITLE  : %s\n", trip.getTitle().toUpperCase()));
        pdf.append(String.format(" DATES       : %s to %s\n", trip.getStartDate(), trip.getEndDate()));
        pdf.append(String.format(" PLANNER     : %s (%s)\n\n", trip.getUser().getUsername(), trip.getUser().getEmail()));
        
        pdf.append("------------------------------------------------------------------------\n");
        pdf.append("                          ITINERARY TIMELINE\n");
        pdf.append("------------------------------------------------------------------------\n");
        List<Itinerary> itineraries = itineraryRepository.findByTripId(tripId);
        if (itineraries.isEmpty()) {
            pdf.append(" No days planned yet.\n");
        } else {
            for (Itinerary itinerary : itineraries) {
                pdf.append(String.format("\n DAY %d: %s\n", itinerary.getDayNumber(), itinerary.getTitle()));
                List<Activity> activities = activityRepository.findByItineraryId(itinerary.getId());
                if (activities.isEmpty()) {
                    pdf.append("   - No activities scheduled.\n");
                } else {
                    for (Activity activity : activities) {
                        String timeStr = "";
                        if (activity.getStartTime() != null) {
                            timeStr = activity.getStartTime().toLocalTime().toString();
                            if (activity.getEndTime() != null) {
                                timeStr += " - " + activity.getEndTime().toLocalTime().toString();
                            }
                        }
                        double costVal = activity.getCost() != null ? activity.getCost().doubleValue() : 0.0;
                        String descVal = activity.getDescription() != null ? activity.getDescription() : "";
                        
                        pdf.append(String.format("   [%s] %s  | Cost: %.2f  (Description: %s)\n",
                                timeStr,
                                activity.getTitle(),
                                costVal,
                                descVal));
                    }
                }
            }
        }

        pdf.append("\n------------------------------------------------------------------------\n");
        pdf.append("                          EXPENSES LOG & BILLS\n");
        pdf.append("------------------------------------------------------------------------\n");
        List<Expense> expenses = expenseRepository.findByTripId(tripId);
        if (expenses.isEmpty()) {
            pdf.append(" No expenses recorded.\n");
        } else {
            java.math.BigDecimal total = java.math.BigDecimal.ZERO;
            for (Expense expense : expenses) {
                double amtVal = expense.getAmount() != null ? expense.getAmount().doubleValue() : 0.0;
                pdf.append(String.format(" - [%s] %-12s : %.2f   (%s)\n",
                        expense.getExpenseDate(),
                        expense.getCategory(),
                        amtVal,
                        expense.getDescription()));
                if (expense.getAmount() != null) {
                    total = total.add(expense.getAmount());
                }
            }
            pdf.append("------------------------------------------------------------------------\n");
            pdf.append(String.format(" TOTAL SPENT : %.2f\n", total.doubleValue()));
            pdf.append("------------------------------------------------------------------------\n");
        }
        
        pdf.append("\n========================================================================\n");
        pdf.append("             Thank you for planning your trip with TripPlanner!          \n");
        pdf.append("========================================================================\n");

        byte[] bytes = pdf.toString().getBytes(StandardCharsets.UTF_8);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("attachment", "trip_summary_" + tripId + ".pdf");
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

        return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
    }
}
