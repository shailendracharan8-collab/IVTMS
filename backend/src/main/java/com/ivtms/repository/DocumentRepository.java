package com.ivtms.repository;

import com.ivtms.entity.Document;
import com.ivtms.entity.User;
import com.ivtms.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByOwnerAndIsActiveTrueOrderByUploadDateDesc(User owner);
    List<Document> findByVehicleAndIsActiveTrue(Vehicle vehicle);
    List<Document> findByStatusOrderByUploadDateDesc(String status);
    List<Document> findByOwnerAndExpiryDateBetweenAndIsActiveTrue(User owner, LocalDate startDate, LocalDate endDate);
    List<Document> findByExpiryDateBetweenAndIsActiveTrue(LocalDate startDate, LocalDate endDate);
}
