package com.tripnest.repository;

import com.tripnest.entity.Destination;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DestinationRepository extends JpaRepository<Destination, Long> {
    List<Destination> findByRegionIgnoreCaseOrderByNameAsc(String region);
    List<Destination> findByNameContainingIgnoreCaseOrCountryContainingIgnoreCaseOrderByNameAsc(String name, String country);
    boolean existsByNameIgnoreCase(String name);
}
