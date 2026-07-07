package com.tripnest.repository;

import com.tripnest.entity.Expense;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByTripIdOrderByExpenseDateDescIdDesc(Long tripId);

    @Query("select coalesce(sum(e.amount), 0) from Expense e where e.trip.id = :tripId")
    BigDecimal sumAmountByTripId(@Param("tripId") Long tripId);

    @Query("select coalesce(sum(e.amount), 0) from Expense e")
    BigDecimal sumAllAmounts();
}
