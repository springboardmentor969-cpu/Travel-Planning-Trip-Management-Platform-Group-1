package com.tripnest.repository;

import com.tripnest.entity.Trip;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepository extends JpaRepository<Trip, Long> {
    @Query("""
        select distinct t
        from Trip t
        left join t.collaborators c
        where t.user.id = :userId or c.id = :userId
        order by t.startDate asc, t.id asc
        """)
    List<Trip> findAccessibleByUserId(@Param("userId") Long userId);

    @Query("""
        select distinct t
        from Trip t
        left join t.collaborators c
        where (t.user.id = :userId or c.id = :userId) and t.startDate >= :date
        order by t.startDate asc, t.id asc
        """)
    List<Trip> findUpcomingAccessibleByUserId(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("""
        select count(distinct t)
        from Trip t
        left join t.collaborators c
        where t.user.id = :userId or c.id = :userId
        """)
    long countAccessibleByUserId(@Param("userId") Long userId);

}
