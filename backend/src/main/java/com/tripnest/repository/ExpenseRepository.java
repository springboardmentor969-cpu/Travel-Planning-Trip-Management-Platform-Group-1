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

    @Query("select coalesce(sum(e.amount), 0) from Expense e where e.trip.user.id = :userId")
    BigDecimal sumByTripUserId(@Param("userId") Long userId);

    @Query("""
            select coalesce(sum(e.amount), 0)
            from Expense e
            where e.trip.user.id = :userId or exists (
                select 1
                from Trip t2 join t2.collaborators c
                where t2.id = e.trip.id and c.id = :userId
            )
            """)
    BigDecimal sumByAccessibleUserId(@Param("userId") Long userId);
}
