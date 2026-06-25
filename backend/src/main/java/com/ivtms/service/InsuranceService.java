package com.ivtms.service;

import com.ivtms.dto.ClaimDTO;
import com.ivtms.dto.InsuranceDTO;
import com.ivtms.entity.InsuranceClaim;
import com.ivtms.entity.InsurancePolicy;
import com.ivtms.entity.Vehicle;
import com.ivtms.exception.ResourceNotFoundException;
import com.ivtms.repository.InsuranceClaimRepository;
import com.ivtms.repository.InsurancePolicyRepository;
import com.ivtms.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InsuranceService {

    @Autowired
    private InsurancePolicyRepository policyRepository;

    @Autowired
    private InsuranceClaimRepository claimRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Transactional
    public InsuranceDTO addPolicy(String registrationNumber, InsuranceDTO dto, org.springframework.web.multipart.MultipartFile file) {
        Vehicle vehicle = vehicleRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + registrationNumber));
        
        String fileName = fileStorageService.storeFile(file);

        InsurancePolicy policy = InsurancePolicy.builder()
                .policyNumber(dto.getPolicyNumber())
                .policyType(dto.getPolicyType())
                .insuranceProvider(dto.getInsuranceProvider())
                .startDate(dto.getStartDate())
                .expiryDate(dto.getExpiryDate())
                .premiumAmount(dto.getPremiumAmount())
                .coverageAmount(dto.getCoverageAmount())
                .claimHistory(dto.getClaimHistory())
                .documentPath(fileName)
                .status("PENDING_VERIFICATION")
                .vehicle(vehicle)
                .build();

        return mapPolicyToDTO(policyRepository.save(policy));
    }

    @Transactional
    public InsuranceDTO verifyPolicy(Long policyId, boolean approve, String reason) {
        InsurancePolicy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found: " + policyId));
        
        if (approve) {
            policy.setStatus("VERIFIED");
            policy.setRejectionReason(null);
        } else {
            policy.setStatus("REJECTED");
            policy.setRejectionReason(reason);
        }
        
        return mapPolicyToDTO(policyRepository.save(policy));
    }

    public List<InsuranceDTO> getPendingPolicies() {
        return policyRepository.findByStatus("PENDING_VERIFICATION").stream()
                .map(this::mapPolicyToDTO)
                .collect(Collectors.toList());
    }

    public List<InsuranceDTO> getCitizenPolicies(String email) {
        return policyRepository.findByVehicle_Owner_EmailIgnoreCase(email).stream()
                .map(this::mapPolicyToDTO)
                .collect(Collectors.toList());
    }

    public List<ClaimDTO> getCitizenClaims(String email) {
        return claimRepository.findByPolicy_Vehicle_Owner_EmailIgnoreCase(email).stream()
                .map(this::mapClaimToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClaimDTO fileClaim(String policyNumber, ClaimDTO dto) {
        InsurancePolicy policy = policyRepository.findByPolicyNumber(policyNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found: " + policyNumber));
        
        InsuranceClaim claim = InsuranceClaim.builder()
                .claimNumber(dto.getClaimNumber())
                .claimDate(dto.getClaimDate())
                .claimAmount(dto.getClaimAmount())
                .description(dto.getDescription())
                .claimStatus("PENDING")
                .policy(policy)
                .build();

        return mapClaimToDTO(claimRepository.save(claim));
    }

    public List<InsuranceDTO> getPoliciesByVehicle(String registrationNumber) {
        Vehicle vehicle = vehicleRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + registrationNumber));
        
        return policyRepository.findByVehicleId(vehicle.getId()).stream()
                .map(this::mapPolicyToDTO)
                .collect(Collectors.toList());
    }

    public byte[] generatePolicyPdf(String policyNumber) {
        InsurancePolicy policy = policyRepository.findByPolicyNumber(policyNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found: " + policyNumber));
        
        try (java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream()) {
            com.lowagie.text.Document document = new com.lowagie.text.Document();
            com.lowagie.text.pdf.PdfWriter.getInstance(document, baos);
            document.open();
            
            com.lowagie.text.Font titleFont = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 18, com.lowagie.text.Font.BOLD);
            com.lowagie.text.Paragraph title = new com.lowagie.text.Paragraph("IVTMS - Vehicle Insurance Policy", titleFont);
            title.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            document.add(title);
            document.add(new com.lowagie.text.Paragraph(" "));
            
            document.add(new com.lowagie.text.Paragraph("Policy Number: " + policy.getPolicyNumber()));
            document.add(new com.lowagie.text.Paragraph("Provider: " + policy.getInsuranceProvider()));
            document.add(new com.lowagie.text.Paragraph("Vehicle Registration: " + policy.getVehicle().getRegistrationNumber()));
            document.add(new com.lowagie.text.Paragraph("Start Date: " + policy.getStartDate()));
            document.add(new com.lowagie.text.Paragraph("Expiry Date: " + policy.getExpiryDate()));
            document.add(new com.lowagie.text.Paragraph("Premium Amount: Rs. " + policy.getPremiumAmount()));
            document.add(new com.lowagie.text.Paragraph("Coverage Amount: Rs. " + policy.getCoverageAmount()));
            document.add(new com.lowagie.text.Paragraph("Status: " + policy.getStatus()));
            
            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    private InsuranceDTO mapPolicyToDTO(InsurancePolicy policy) {
        return InsuranceDTO.builder()
                .policyNumber(policy.getPolicyNumber())
                .policyType(policy.getPolicyType())
                .insuranceProvider(policy.getInsuranceProvider())
                .startDate(policy.getStartDate())
                .expiryDate(policy.getExpiryDate())
                .premiumAmount(policy.getPremiumAmount())
                .coverageAmount(policy.getCoverageAmount())
                .claimHistory(policy.getClaimHistory())
                .documentPath(policy.getDocumentPath())
                .status(policy.getStatus())
                .rejectionReason(policy.getRejectionReason())
                .vehicleRegistration(policy.getVehicle() != null ? policy.getVehicle().getRegistrationNumber() : null)
                .vehicleInfo(policy.getVehicle() != null ? policy.getVehicle().getManufacturer() + " " + policy.getVehicle().getModel() : null)
                .build();
    }

    private ClaimDTO mapClaimToDTO(InsuranceClaim claim) {
        return ClaimDTO.builder()
                .claimNumber(claim.getClaimNumber())
                .claimDate(claim.getClaimDate())
                .claimAmount(claim.getClaimAmount())
                .description(claim.getDescription())
                .claimStatus(claim.getClaimStatus())
                .vehicleRegistration(claim.getPolicy() != null && claim.getPolicy().getVehicle() != null ? claim.getPolicy().getVehicle().getRegistrationNumber() : "N/A")
                .policyNumber(claim.getPolicy() != null ? claim.getPolicy().getPolicyNumber() : "N/A")
                .build();
    }
}
