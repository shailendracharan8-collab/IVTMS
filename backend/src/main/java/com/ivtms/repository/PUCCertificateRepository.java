package com.ivtms.repository;

import com.ivtms.entity.PUCCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PUCCertificateRepository extends JpaRepository<PUCCertificate, Long> {
    Optional<PUCCertificate> findByCertificateNumber(String certificateNumber);
    List<PUCCertificate> findByVehicleId(Long vehicleId);
    Optional<PUCCertificate> findTopByVehicleIdOrderByTestDateDesc(Long vehicleId);
    List<PUCCertificate> findByExpiryDateBetweenAndStatus(java.time.LocalDate start, java.time.LocalDate end, String status);
}
