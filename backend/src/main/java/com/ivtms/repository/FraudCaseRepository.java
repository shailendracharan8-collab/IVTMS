package com.ivtms.repository;

import com.ivtms.entity.FraudCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FraudCaseRepository extends JpaRepository<FraudCase, Long> {
    List<FraudCase> findByStatus(String status);
    long countByStatus(String status);
    long countBySeverity(String severity);
    List<FraudCase> findByVehicleNo(String vehicleNo);
    boolean existsByVehicleNoAndDescription(String vehicleNo, String description);
}
