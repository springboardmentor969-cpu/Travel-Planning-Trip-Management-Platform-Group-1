package com.tripnest.repository;

import com.tripnest.entity.Expense;
import com.tripnest.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByTripOrderByExpenseDateDesc(Trip trip);
    
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.trip = :trip")
    Double sumAmountByTrip(@Param("trip") Trip trip);

    @Query("SELECT e.category, COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.trip = :trip GROUP BY e.category")
    List<Object[]> sumAmountByTripGroupByCategory(@Param("trip") Trip trip);

    @Query("SELECT e.paidBy.id, e.paidBy.fullName, COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.trip = :trip GROUP BY e.paidBy.id, e.paidBy.fullName")
    List<Object[]> sumAmountByTripGroupByPaidBy(@Param("trip") Trip trip);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e")
    Double sumTotalAllExpenses();
}
