package com.travelplanner.repository;

import com.travelplanner.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUserId(Long userId);

    @Query("SELECT DISTINCT t FROM Trip t LEFT JOIN t.collaborators c WHERE t.user.id = :userId OR c.id = :userId")
    List<Trip> findByUserIdOrCollaboratorId(@Param("userId") Long userId);
}
