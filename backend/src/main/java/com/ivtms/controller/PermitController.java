package com.ivtms.controller;

import com.ivtms.entity.Permit;
import com.ivtms.entity.Vehicle;
import com.ivtms.repository.PermitRepository;
import com.ivtms.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/permits")
public class PermitController {

    @Autowired
    private PermitRepository permitRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @PostMapping("/issue")
    public ResponseEntity<?> issuePermit(@RequestBody Map<String, String> payload) {
        String rcNumber = payload.get("rcNumber");
        String type = payload.get("permitType");
        String expiryStr = payload.get("expiryDate");
        String areaOfOperation = payload.get("areaOfOperation");

        Vehicle vehicle = vehicleRepository.findByRegistrationNumber(rcNumber)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        Permit permit = Permit.builder()
                .permitType(type)
                .permitNumber("PRM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .issueDate(LocalDate.now())
                .expiryDate(LocalDate.parse(expiryStr))
                .areaOfOperation(areaOfOperation)
                .status("Active")
                .vehicle(vehicle)
                .build();

        permitRepository.save(permit);

        return ResponseEntity.ok(Map.of("message", "Permit issued successfully", "permitNumber", permit.getPermitNumber()));
    }

    @PostMapping("/renew/{permitNumber}")
    public ResponseEntity<?> renewPermit(@PathVariable String permitNumber) {
        Permit permit = permitRepository.findByPermitNumber(permitNumber)
                .orElseThrow(() -> new RuntimeException("Permit not found"));

        // Extend by 1 year
        permit.setExpiryDate(permit.getExpiryDate().plusYears(1));
        permit.setStatus("Active");
        permitRepository.save(permit);

        return ResponseEntity.ok(Map.of("message", "Permit renewed successfully", "newExpiry", permit.getExpiryDate().toString()));
    }

    @GetMapping("/download/{permitNumber}")
    public ResponseEntity<byte[]> downloadPermit(@PathVariable String permitNumber) {
        Permit permit = permitRepository.findByPermitNumber(permitNumber)
                .orElseThrow(() -> new RuntimeException("Permit not found: " + permitNumber));
        
        byte[] pdf;
        try (java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream()) {
            com.lowagie.text.Document document = new com.lowagie.text.Document();
            com.lowagie.text.pdf.PdfWriter.getInstance(document, baos);
            document.open();
            
            com.lowagie.text.Font titleFont = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 18, com.lowagie.text.Font.BOLD);
            com.lowagie.text.Paragraph title = new com.lowagie.text.Paragraph("IVTMS - Vehicle Permit", titleFont);
            title.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            document.add(title);
            document.add(new com.lowagie.text.Paragraph(" "));
            
            document.add(new com.lowagie.text.Paragraph("Permit Number: " + permit.getPermitNumber()));
            document.add(new com.lowagie.text.Paragraph("Vehicle Registration: " + permit.getVehicle().getRegistrationNumber()));
            document.add(new com.lowagie.text.Paragraph("Permit Type: " + permit.getPermitType()));
            document.add(new com.lowagie.text.Paragraph("Issue Date: " + permit.getIssueDate()));
            document.add(new com.lowagie.text.Paragraph("Expiry Date: " + permit.getExpiryDate()));
            document.add(new com.lowagie.text.Paragraph("Area of Operation: " + permit.getAreaOfOperation()));
            document.add(new com.lowagie.text.Paragraph("Status: " + permit.getStatus()));
            
            document.close();
            pdf = baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=permit_" + permitNumber + ".pdf")
                .header("Content-Type", "application/pdf")
                .body(pdf);
    }
}
