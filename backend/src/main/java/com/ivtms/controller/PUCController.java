package com.ivtms.controller;

import com.ivtms.entity.PUCCertificate;
import com.ivtms.service.PUCService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/puc")
public class PUCController {

    @Autowired
    private PUCService pucService;

    @PostMapping("/book/{registrationNumber}")
    public ResponseEntity<com.ivtms.entity.PUCAppointment> bookAppointment(
            @PathVariable String registrationNumber,
            @RequestBody com.ivtms.entity.PUCAppointment appointment,
            java.security.Principal principal) {
        return ResponseEntity.ok(pucService.bookAppointment(principal.getName(), registrationNumber, appointment));
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<com.ivtms.entity.PUCAppointment>> getMyAppointments(java.security.Principal principal) {
        return ResponseEntity.ok(pucService.getUserAppointments(principal.getName()));
    }

    @PostMapping("/{registrationNumber}")
    public ResponseEntity<PUCCertificate> addPUC(@PathVariable String registrationNumber, @RequestBody PUCCertificate certificate) {
        return ResponseEntity.ok(pucService.addPUCCertificate(registrationNumber, certificate));
    }

    @GetMapping("/history/{registrationNumber}")
    public ResponseEntity<List<PUCCertificate>> getHistory(@PathVariable String registrationNumber) {
        return ResponseEntity.ok(pucService.getPUCHistory(registrationNumber));
    }

    @GetMapping("/download/{certificateNumber}")
    public ResponseEntity<byte[]> downloadPUC(@PathVariable String certificateNumber) {
        byte[] pdf = pucService.generatePucPdf(certificateNumber);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=puc_" + certificateNumber + ".pdf")
                .header("Content-Type", "application/pdf")
                .body(pdf);
    }

    @GetMapping("/download-by-rc/{registrationNumber}")
    public ResponseEntity<byte[]> downloadPUCByRc(@PathVariable String registrationNumber) {
        byte[] pdf = pucService.generatePucPdf("PUC-" + registrationNumber);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=puc_" + registrationNumber + ".pdf")
                .header("Content-Type", "application/pdf")
                .body(pdf);
    }
}
