package com.workforce.repository;

import com.workforce.entity.DressCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DressCodeRepository extends JpaRepository<DressCode, Long> {
    List<DressCode> findByCompanyId(Long companyId);
    Optional<DressCode> findByCompanyIdAndDayOfWeek(Long companyId, String dayOfWeek);
}
