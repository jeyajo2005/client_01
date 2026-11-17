package com.workforce.repository;

import com.workforce.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByCompanyId(Long companyId);
    List<Location> findByCompanyIdAndIsActiveTrue(Long companyId);
}
