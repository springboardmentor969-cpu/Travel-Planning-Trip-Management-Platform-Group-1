package com.tripnest.mapper;

import com.tripnest.dto.ExpenseDto;
import com.tripnest.entity.Expense;

public final class ExpenseMapper {
    private ExpenseMapper() {
    }

    public static ExpenseDto toDto(Expense expense) {
        return new ExpenseDto(
                expense.getId(),
                expense.getCategory(),
                expense.getAmount(),
                expense.getDescription(),
                expense.getExpenseDate(),
                expense.getTrip().getId()
        );
    }

    public static void updateEntity(Expense expense, ExpenseDto dto) {
        expense.setCategory(dto.category());
        expense.setAmount(dto.amount());
        expense.setDescription(dto.description());
        expense.setExpenseDate(dto.expenseDate());
    }
}
