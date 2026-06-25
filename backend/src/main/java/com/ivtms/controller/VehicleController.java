package com.ivtms.controller;

import com.ivtms.dto.VehicleDTO;
import com.ivtms.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/vehicles", "/api/vehicle"})
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @PostMapping("/register")
    public ResponseEntity<VehicleDTO> registerVehicle(@Valid @RequestBody VehicleDTO vehicleDTO) {
        return ResponseEntity.ok(vehicleService.registerVehicle(vehicleDTO));
    }

    @GetMapping
    public ResponseEntity<?> getVehicleByQuery(@RequestParam(required = false) String rc) {
        if (rc != null) {
            try {
                return ResponseEntity.ok(vehicleService.getVehicleByRegistrationNumber(rc));
            } catch (Exception e) {
                return ResponseEntity.ok().body("{\"error\": \"Vehicle not found\"}");
            }
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/link")
    public ResponseEntity<?> linkVehicle(@RequestParam Long userId, @RequestParam String rc, @RequestParam String chassis) {
        try {
            return ResponseEntity.ok(vehicleService.linkVehicleToUser(userId, rc, chassis));
        } catch (Exception e) {
            return ResponseEntity.ok().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/{registrationNumber}")
    public ResponseEntity<VehicleDTO> getVehicle(@PathVariable String registrationNumber) {
        return ResponseEntity.ok(vehicleService.getVehicleByRegistrationNumber(registrationNumber));
    }

    // Explicitly adding the endpoint requested by the user
    @GetMapping("/fetch/{registrationNumber}")
    public ResponseEntity<VehicleDTO> fetchVehicle(@PathVariable String registrationNumber) {
        return ResponseEntity.ok(vehicleService.getVehicleByRegistrationNumber(registrationNumber));
    }

    @GetMapping("/owner/{username}")
    public ResponseEntity<List<VehicleDTO>> getVehiclesByOwner(@PathVariable String username) {
        return ResponseEntity.ok(vehicleService.getVehiclesByOwner(username));
    }

    @GetMapping("/download/{registrationNumber}")
    public ResponseEntity<byte[]> downloadRC(@PathVariable String registrationNumber) {
        VehicleDTO vehicle = vehicleService.getVehicleByRegistrationNumber(registrationNumber);
        
        byte[] pdf;
        try (java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream()) {
            com.lowagie.text.Document document = new com.lowagie.text.Document();
            com.lowagie.text.pdf.PdfWriter.getInstance(document, baos);
            document.open();
            
            com.lowagie.text.Font titleFont = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 18, com.lowagie.text.Font.BOLD);
            com.lowagie.text.Paragraph title = new com.lowagie.text.Paragraph("IVTMS - Vehicle Registration Certificate", titleFont);
            title.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            document.add(title);
            document.add(new com.lowagie.text.Paragraph(" "));
            
            document.add(new com.lowagie.text.Paragraph("Registration Number: " + vehicle.getRegistrationNumber()));
            document.add(new com.lowagie.text.Paragraph("Chassis Number: " + vehicle.getChassisNumber()));
            document.add(new com.lowagie.text.Paragraph("Engine Number: " + vehicle.getEngineNumber()));
            document.add(new com.lowagie.text.Paragraph("Make: " + vehicle.getManufacturer()));
            document.add(new com.lowagie.text.Paragraph("Model: " + vehicle.getModel()));
            document.add(new com.lowagie.text.Paragraph("Vehicle Type: " + vehicle.getVehicleType()));
            document.add(new com.lowagie.text.Paragraph("Fuel Type: " + vehicle.getFuelType()));
            document.add(new com.lowagie.text.Paragraph("Manufacturing Year: " + vehicle.getManufacturingYear()));
            document.add(new com.lowagie.text.Paragraph("Compliance: Tax "
                    + java.util.Objects.toString(vehicle.getTaxStatus(), "—")
                    + ", Insurance " + java.util.Objects.toString(vehicle.getInsuranceStatus(), "—")));
            
            document.close();
            pdf = baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=rc_" + registrationNumber + ".pdf")
                .header("Content-Type", "application/pdf")
                .body(pdf);
    }
}
