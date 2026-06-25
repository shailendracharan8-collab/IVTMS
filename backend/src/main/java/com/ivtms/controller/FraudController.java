package com.ivtms.controller;

import com.ivtms.entity.FraudCase;
import com.ivtms.repository.FraudCaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import com.ivtms.service.AuditLogService;

@RestController
@RequestMapping("/api/fraud")
public class FraudController {

    @Autowired
    private FraudCaseRepository fraudCaseRepository;

    @Autowired
    private com.ivtms.service.FraudDetectionService fraudDetectionService;

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping("/{id}")
    public ResponseEntity<FraudCase> getFraudCase(@PathVariable Long id) {
        return fraudCaseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body, Principal principal) {
        String status = body.get("status");
        String remarks = body.get("remarks");
        return fraudCaseRepository.findById(id).map(c -> {
            c.setStatus(status);
            if (remarks != null && !remarks.isEmpty()) {
                c.setRemarks((c.getRemarks() != null ? c.getRemarks() + " | " : "") + remarks);
            }
            fraudCaseRepository.save(c);
            
            auditLogService.log(
                principal != null ? principal.getName() : "SYSTEM",
                "FRAUD_STATUS_UPDATE",
                "Vehicle: " + c.getVehicleNo(),
                status,
                "0.0.0.0",
                "Status updated with remarks: " + remarks
            );
            
            return ResponseEntity.ok(Map.of("message", "Fraud case status updated to " + status));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/investigate/{vehicleNo}")
    public ResponseEntity<?> investigateFraud(@PathVariable String vehicleNo, Principal principal) {
        List<FraudCase> cases = fraudCaseRepository.findByVehicleNo(vehicleNo);
        if (!cases.isEmpty()) {
            FraudCase fraudCase = cases.get(0);
            fraudCase.setStatus("Escalated");
            fraudCase.setRemarks((fraudCase.getRemarks() != null ? fraudCase.getRemarks() + " | " : "") + "Investigation initiated by RTO Officer.");
            fraudCaseRepository.save(fraudCase);
            
            auditLogService.log(
                principal != null ? principal.getName() : "SYSTEM",
                "FRAUD_INVESTIGATION_START",
                "Vehicle: " + vehicleNo,
                "Escalated",
                "0.0.0.0",
                "Manual investigation initiated by RTO officer."
            );
            
            return ResponseEntity.ok(Map.of("message", "Forensic investigation initiated for vehicle " + vehicleNo));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/cases")
    public List<FraudCase> listAllCases() {
        return fraudCaseRepository.findAll();
    }
}
