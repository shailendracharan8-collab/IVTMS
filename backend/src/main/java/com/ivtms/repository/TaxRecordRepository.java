package com.ivtms.repository;

import com.ivtms.entity.TaxRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaxRecordRepository extends JpaRepository<TaxRecord, Long> {
    List<TaxRecord> findByVehicleId(Long vehicleId);
    Optional<TaxRecord> findByReceiptNumber(String receiptNumber);
}
