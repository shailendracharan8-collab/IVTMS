package com.ivtms.repository;

import com.ivtms.entity.InsuranceClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InsuranceClaimRepository extends JpaRepository<InsuranceClaim, Long> {
    Optional<InsuranceClaim> findByClaimNumber(String claimNumber);
    List<InsuranceClaim> findByPolicyId(Long policyId);
    List<InsuranceClaim> findByPolicy_Vehicle_Owner_EmailIgnoreCase(String email);
}
