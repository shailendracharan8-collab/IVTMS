package com.ivtms.service;

import com.ivtms.entity.FraudCase;
import com.ivtms.entity.Vehicle;
import com.ivtms.repository.FraudCaseRepository;
import com.ivtms.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FraudDetectionService {

    @Autowired
    private FraudCaseRepository fraudCaseRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    /**
     * Runs basic checks to identify potential fraud cases every hour.
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void runAutomatedChecks() {
        runManualScan();
    }

    public int runManualScan() {
        List<Vehicle> allVehicles = vehicleRepository.findAll();
        int newCasesCount = 0;
        
        for (Vehicle vehicle : allVehicles) {
            // Rule 1: Duplicate Chassis Check
            newCasesCount += checkDuplicateChassis(vehicle);
        }
        return newCasesCount;
    }

    private int checkDuplicateChassis(Vehicle v1) {
        if (v1.getChassisNumber() == null) return 0;
        
        final int[] count = {0};
        vehicleRepository.findByChassisNumber(v1.getChassisNumber()).stream()
                .filter(v2 -> !v2.getId().equals(v1.getId()))
                .forEach(v2 -> {
                    String caseDesc = "Duplicate chassis detected: " + v1.getRegistrationNumber() + " and " + v2.getRegistrationNumber();
                    if (reportFraud(v1.getRegistrationNumber(), "Duplicate Chassis", caseDesc)) {
                        count[0]++;
                    }
                });
        return count[0];
    }

    private boolean reportFraud(String vehicleNo, String type, String desc) {
        if (!fraudCaseRepository.existsByVehicleNoAndDescription(vehicleNo, desc)) {
            FraudCase fraud = FraudCase.builder()
                    .vehicleNo(vehicleNo)
                    .flagType(type)
                    .description(desc)
                    .reportedBy("AI-System")
                    .reportedDate(LocalDateTime.now())
                    .severity("High")
                    .status("Open")
                    .remarks("System flagged: Potential duplicate or identity theft.")
                    .build();
            fraudCaseRepository.save(fraud);
            return true;
        }
        return false;
    }
}
