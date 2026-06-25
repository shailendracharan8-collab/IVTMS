package com.ivtms.repository;

import com.ivtms.entity.Permit;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermitRepository extends JpaRepository<Permit, Long> {
    Optional<Permit> findByPermitNumber(String permitNumber);
    @EntityGraph(attributePaths = "vehicle")
    List<Permit> findByVehicleId(Long vehicleId);
    long countByStatus(String status);
}
