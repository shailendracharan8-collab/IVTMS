package com.ivtms.repository;

import com.ivtms.entity.InsurancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InsurancePolicyRepository extends JpaRepository<InsurancePolicy, Long> {
    Optional<InsurancePolicy> findByPolicyNumber(String policyNumber);
    List<InsurancePolicy> findByVehicleId(Long vehicleId);
    List<InsurancePolicy> findByStatus(String status);
    List<InsurancePolicy> findByVehicle_Owner_EmailIgnoreCase(String email);
    List<InsurancePolicy> findByExpiryDateBetweenAndStatus(java.time.LocalDate start, java.time.LocalDate end, String status);
}
