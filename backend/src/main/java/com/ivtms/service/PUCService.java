package com.ivtms.service;

import com.ivtms.entity.PUCCertificate;
import com.ivtms.entity.User;
import com.ivtms.entity.Vehicle;
import com.ivtms.exception.ResourceNotFoundException;
import com.ivtms.repository.PUCCertificateRepository;
import com.ivtms.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PUCService {

    @Autowired
    private PUCCertificateRepository pucRepository;

    @Autowired
    private com.ivtms.repository.PUCAppointmentRepository appointmentRepository;

    @Autowired
    private com.ivtms.repository.UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Transactional
    public com.ivtms.entity.PUCAppointment bookAppointment(String userEmail, String registrationNumber, com.ivtms.entity.PUCAppointment appointment) {
        User user = userRepository.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        
        appointment.setUser(user);
        appointment.setRegistrationNumber(registrationNumber);
        appointment.setStatus("SCHEDULED");
        
        return appointmentRepository.save(appointment);
    }

    public List<com.ivtms.entity.PUCAppointment> getUserAppointments(String email) {
        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow();
        return appointmentRepository.findByUserId(user.getId());
    }

    @Transactional
    public PUCCertificate addPUCCertificate(String registrationNumber, PUCCertificate certificate) {
        Vehicle vehicle = vehicleRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with registration number: " + registrationNumber));
        
        certificate.setVehicle(vehicle);
        
        // Update vehicle status based on PUC result
        if ("PASS".equalsIgnoreCase(certificate.getResult())) {
            vehicle.setStatus("COMPLIANT");
            certificate.setStatus("ACTIVE");
        } else {
            vehicle.setStatus("NON_COMPLIANT");
            certificate.setStatus("NON_COMPLIANT");
        }
        
        vehicleRepository.save(vehicle);
        return pucRepository.save(certificate);
    }

    public List<PUCCertificate> getPUCHistory(String registrationNumber) {
        Vehicle vehicle = vehicleRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with registration number: " + registrationNumber));
        return pucRepository.findByVehicleId(vehicle.getId());
    }

    public byte[] generatePucPdf(String certificateNumber) {
        PUCCertificate certificate = pucRepository.findByCertificateNumber(certificateNumber)
                .orElseThrow(() -> new ResourceNotFoundException("PUC Certificate not found: " + certificateNumber));
        
        try (java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream()) {
            com.lowagie.text.Document document = new com.lowagie.text.Document();
            com.lowagie.text.pdf.PdfWriter.getInstance(document, baos);
            document.open();
            
            com.lowagie.text.Font titleFont = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 18, com.lowagie.text.Font.BOLD);
            com.lowagie.text.Paragraph title = new com.lowagie.text.Paragraph("IVTMS - PUC Certificate", titleFont);
            title.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            document.add(title);
            document.add(new com.lowagie.text.Paragraph(" "));
            
            document.add(new com.lowagie.text.Paragraph("Certificate Number: " + certificate.getCertificateNumber()));
            document.add(new com.lowagie.text.Paragraph("Vehicle Registration: " + certificate.getVehicle().getRegistrationNumber()));
            document.add(new com.lowagie.text.Paragraph("Test Date: " + certificate.getTestDate()));
            document.add(new com.lowagie.text.Paragraph("Valid Until: " + certificate.getExpiryDate()));
            document.add(new com.lowagie.text.Paragraph("Carbon Monoxide (CO): " + certificate.getCarbonMonoxideLevel()));
            document.add(new com.lowagie.text.Paragraph("Hydrocarbon (HC): " + certificate.getHydrocarbonLevel()));
            document.add(new com.lowagie.text.Paragraph("Result: " + certificate.getStatus()));
            
            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }
}
