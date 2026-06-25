package com.ivtms.repository;

import com.ivtms.entity.PUCAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PUCAppointmentRepository extends JpaRepository<PUCAppointment, Long> {
    List<PUCAppointment> findByUserId(Long userId);
    List<PUCAppointment> findByRegistrationNumber(String registrationNumber);
}
