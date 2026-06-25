package com.ivtms.service;

import com.ivtms.entity.AQIReading;
import com.ivtms.repository.AQIReadingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AQIService {

    @Autowired
    private AQIReadingRepository aqiRepository;

    public AQIReading saveReading(AQIReading reading) {
        if (reading.getTimestamp() == null) {
            reading.setTimestamp(LocalDateTime.now());
        }
        return aqiRepository.save(reading);
    }

    public List<AQIReading> getLatestReadings(String location) {
        return aqiRepository.findByLocationOrderByTimestampDesc(location);
    }
}
