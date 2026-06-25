package com.ivtms.controller;

import com.ivtms.dto.ClaimDTO;
import com.ivtms.dto.InsuranceDTO;
import com.ivtms.service.InsuranceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/insurance")
public class InsuranceController {

    @Autowired
    private InsuranceService insuranceService;

    @PostMapping(value = "/policy/{registrationNumber}", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<InsuranceDTO> addPolicy(
            @PathVariable String registrationNumber,
            @RequestPart("policy") InsuranceDTO policy,
            @RequestPart("file") org.springframework.web.multipart.MultipartFile file) {
        return ResponseEntity.ok(insuranceService.addPolicy(registrationNumber, policy, file));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<InsuranceDTO>> getPendingPolicies() {
        return ResponseEntity.ok(insuranceService.getPendingPolicies());
    }

    @PostMapping("/verify/{policyId}")
    public ResponseEntity<InsuranceDTO> verifyPolicy(@PathVariable Long policyId, @RequestBody java.util.Map<String, Object> payload) {
        boolean approve = (boolean) payload.get("approve");
        String reason = (String) payload.get("reason");
        return ResponseEntity.ok(insuranceService.verifyPolicy(policyId, approve, reason));
    }

    @PostMapping("/claim/{policyNumber}")
    public ResponseEntity<ClaimDTO> fileClaim(@PathVariable String policyNumber, @Valid @RequestBody ClaimDTO claim) {
        return ResponseEntity.ok(insuranceService.fileClaim(policyNumber, claim));
    }

    @GetMapping("/policies/{registrationNumber}")
    public ResponseEntity<List<InsuranceDTO>> getPolicies(@PathVariable String registrationNumber) {
        return ResponseEntity.ok(insuranceService.getPoliciesByVehicle(registrationNumber));
    }

    @GetMapping("/download/{policyNumber}")
    public ResponseEntity<byte[]> downloadPolicy(@PathVariable String policyNumber) {
        byte[] pdf = insuranceService.generatePolicyPdf(policyNumber);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=policy_" + policyNumber + ".pdf")
                .header("Content-Type", "application/pdf")
                .body(pdf);
    }

    @GetMapping("/download-by-rc/{registrationNumber}")
    public ResponseEntity<byte[]> downloadPolicyByRc(@PathVariable String registrationNumber) {
        List<InsuranceDTO> policies = insuranceService.getPoliciesByVehicle(registrationNumber);
        if (policies.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String policyNumber = policies.get(0).getPolicyNumber();
        byte[] pdf = insuranceService.generatePolicyPdf(policyNumber);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=policy_" + registrationNumber + ".pdf")
                .header("Content-Type", "application/pdf")
                .body(pdf);
    }
}
