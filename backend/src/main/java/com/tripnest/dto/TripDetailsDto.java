package com.tripnest.dto;

import java.util.List;

public record TripDetailsDto(
        TripDto trip,
        List<ItineraryDto> itinerary,
        List<ExpenseDto> expenses,
        BudgetSummaryDto budgetSummary,
        boolean canEdit,
        boolean isOwner
) {
}
