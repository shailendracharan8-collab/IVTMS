package com.ivtms.repository;

import com.ivtms.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByOwnerId(Long ownerId);
    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
    Boolean existsByRegistrationNumber(String registrationNumber);
    List<Vehicle> findByChassisNumber(String chassisNumber);
}
