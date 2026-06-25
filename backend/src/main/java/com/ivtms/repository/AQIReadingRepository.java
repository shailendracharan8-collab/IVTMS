package com.ivtms.repository;

import com.ivtms.entity.AQIReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AQIReadingRepository extends JpaRepository<AQIReading, Long> {
    List<AQIReading> findByLocationOrderByTimestampDesc(String location);
}
