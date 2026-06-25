package com.ivtms.controller;

import com.ivtms.service.FraudDetectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/fraud")
public class FraudDetectionController {

    @Autowired
    private FraudDetectionService fraudDetectionService;

    @PostMapping("/scan")
    @PreAuthorize("hasAnyRole('RTO', 'ADMIN')")
    public ResponseEntity<?> triggerDeepScan() {
        int newCases = fraudDetectionService.runManualScan();
        return ResponseEntity.ok(Map.of(
            "message", "Deep scan completed successfully",
            "newCasesDetected", newCases
        ));
    }
}
