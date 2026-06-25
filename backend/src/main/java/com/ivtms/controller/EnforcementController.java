package com.ivtms.controller;

import com.ivtms.entity.FraudCase;
import com.ivtms.repository.FraudCaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/enforcement")
public class EnforcementController {

    @Autowired
    private FraudCaseRepository fraudCaseRepository;

    @PostMapping("/fraud/update-status")
    public ResponseEntity<?> updateFraudStatus(@RequestBody Map<String, Object> payload) {
        String vehicleNo = (String) payload.get("vehicleNo");
        String status = (String) payload.get("status");
        String remarks = (String) payload.get("remarks");

        // Find the case and update
        fraudCaseRepository.findByVehicleNo(vehicleNo)
                .forEach(c -> {
                    c.setStatus(status);
                    c.setRemarks(remarks);
                    fraudCaseRepository.save(c);
                });

        return ResponseEntity.ok(Map.of("message", "Vehicle status updated to " + status));
    }
}
