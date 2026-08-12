package com.tripnest.dto;

import com.tripnest.entity.TripExpense;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {
    private Long id;
    private String title;
    private Double amount;
    private String category;
    private LocalDate date;
    private String paidBy;
    private String receiptUrl;

    public static ExpenseResponse from(TripExpense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .amount(expense.getAmount())
                .category(expense.getCategory())
                .date(expense.getDate())
                .paidBy(expense.getPaidBy())
                .receiptUrl(expense.getReceiptUrl())
                .build();
    }
}
