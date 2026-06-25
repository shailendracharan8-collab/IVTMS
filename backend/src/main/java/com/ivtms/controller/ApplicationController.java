package com.ivtms.controller;

import com.ivtms.entity.Application;
import com.ivtms.entity.User;

import com.ivtms.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private com.ivtms.service.FileStorageService fileStorageService;

    @Autowired
    private com.ivtms.repository.UserRepository userRepository;

    @Autowired
    private com.ivtms.service.NotificationService notificationService;

    @Autowired
    private com.ivtms.repository.VehicleRepository vehicleRepository;

    @Autowired
    private com.ivtms.service.AuditLogService auditLogService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationDetails(@PathVariable Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return ResponseEntity.ok(convertToDTO(app));
    }

    private com.ivtms.dto.ApplicationDTO convertToDTO(Application app) {
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
        
        return com.ivtms.dto.ApplicationDTO.builder()
                .id(app.getId())
                .appId(app.getAppId())
                .applicantName(app.getApplicantName())
                .type(app.getType())
                .status(app.getStatus())
                .rtoOffice(app.getRtoOffice())
                .submittedAt(app.getSubmittedAt())
                .formattedSubmittedAt(app.getSubmittedAt() != null ? app.getSubmittedAt().format(formatter) : "N/A")
                .remarks(app.getRemarks())
                .rejectionReason(app.getRejectionReason())
                .aadhaarNumber(app.getAadhaarNumber())
                .phoneNumber(app.getPhoneNumber())
                .email(app.getUser() != null ? app.getUser().getEmail() : "N/A")
                .dob(app.getDob())
                .gender(app.getGender())
                .address(app.getAddress())
                .city(app.getCity())
                .state(app.getState())
                .pincode(app.getPincode())
                .vehicleType(app.getVehicleType())
                .vehicleCategory(app.getVehicleCategory())
                .vehicleModel(app.getVehicleModel())
                .manufacturer(app.getManufacturer())
                .engineNumber(app.getEngineNumber())
                .chassisNumber(app.getChassisNumber())
                .manufacturingYear(app.getManufacturingYear())
                .fuelType(app.getFuelType())
                .vehicleColor(app.getVehicleColor())
                .registrationDate(app.getRegistrationDate())
                .insuranceStatus(app.getInsuranceStatus())
                .insuranceExpiry(app.getInsuranceExpiry())
                .vehicleNumber(app.getVehicleNumber())
                .pucStatus(app.getPucStatus())
                .permitStatus(app.getPermitStatus())
                .insuranceDetails(app.getInsuranceDetails())
                .identityProofUrl(app.getIdentityProofUrl())
                .addressProofUrl(app.getAddressProofUrl())
                .vehicleInvoiceUrl(app.getVehicleInvoiceUrl())
                .existingRcUrl(app.getExistingRcUrl())
                .insuranceDocUrl(app.getInsuranceDocUrl())
                .pucDocUrl(app.getPucDocUrl())
                .vehicleImageUrl(app.getVehicleImageUrl())
                .rcTransferDocUrl(app.getRcTransferDocUrl())
                .fraudRiskScore(app.getFraudRiskScore())
                .complianceStatus(app.getComplianceStatus())
                .requestedDocs(app.getRequestedDocs())
                .build();
    }

    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<org.springframework.core.io.Resource> getFile(
            @PathVariable String fileName, 
            java.security.Principal principal,
            jakarta.servlet.http.HttpServletRequest request) {
        
        // Security Check: Only owner or RTO/Admin can view
        if (principal == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }

        Application app = applicationRepository.findByAnyDocumentUrl(fileName)
                .orElseThrow(() -> new RuntimeException("File mapping not found"));
        
        com.ivtms.entity.User user = userRepository.findByEmailIgnoreCase(principal.getName()).orElse(null);

        boolean isOwner = app.getUser().getEmail().equalsIgnoreCase(principal.getName());
        boolean isStaff = user != null && (user.getRole().contains("RTO") || user.getRole().contains("ADMIN"));

        if (!isOwner && !isStaff) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
        }

        org.springframework.core.io.Resource resource = fileStorageService.loadFileAsResource(fileName);
        
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (java.io.IOException ex) {
            // Fallback
        }
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ApplicationController.class);

    @PostMapping("/register")
    public ResponseEntity<?> registerVehicle(
            @RequestParam(value = "applicantName", required = false) String applicantName,
            @RequestParam(value = "vehicleType", required = false) String vehicleType,
            @RequestParam(value = "vehicleCategory", required = false) String vehicleCategory,
            @RequestParam(value = "vehicleModel", required = false) String vehicleModel,
            @RequestParam(value = "manufacturer", required = false) String manufacturer,
            @RequestParam(value = "engineNumber", required = false) String engineNumber,
            @RequestParam(value = "chassisNumber", required = false) String chassisNumber,
            @RequestParam(value = "fuelType", required = false) String fuelType,
            @RequestParam(value = "manufacturingYear", required = false) String manufacturingYear,
            @RequestParam(value = "vehicleColor", required = false) String vehicleColor,
            @RequestParam(value = "registrationDate", required = false) String registrationDate,
            @RequestParam(value = "insuranceDetails", required = false) String insuranceDetails,
            @RequestParam(value = "insuranceStatus", required = false) String insuranceStatus,
            @RequestParam(value = "pucStatus", required = false) String pucStatus,
            @RequestParam(value = "permitStatus", required = false) String permitStatus,
            @RequestParam(value = "insuranceExpiry", required = false) String insuranceExpiry,
            @RequestParam(value = "vehicleNumber", required = false) String vehicleNumber,
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "identityProof", required = false) org.springframework.web.multipart.MultipartFile identityProof,
            @RequestParam(value = "addressProof", required = false) org.springframework.web.multipart.MultipartFile addressProof,
            @RequestParam(value = "vehicleInvoice", required = false) org.springframework.web.multipart.MultipartFile vehicleInvoice,
            @RequestParam(value = "existingRc", required = false) org.springframework.web.multipart.MultipartFile existingRc,
            @RequestParam(value = "insuranceDoc", required = false) org.springframework.web.multipart.MultipartFile insuranceDoc,
            @RequestParam(value = "pucDoc", required = false) org.springframework.web.multipart.MultipartFile pucDoc,
            @RequestParam(value = "vehicleImage", required = false) org.springframework.web.multipart.MultipartFile vehicleImage,
            @RequestParam(value = "rcTransferDoc", required = false) org.springframework.web.multipart.MultipartFile rcTransferDoc,
            @RequestParam(value = "aadhaarNumber", required = false) String aadhaarNumber,
            @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(value = "dob", required = false) String dob,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "state", required = false) String state,
            @RequestParam(value = "pincode", required = false) String pincode,
            java.security.Principal principal
    ) {
        try {
            log.info("Vehicle registration request received. userId={}, applicantName={}", userId, applicantName);

            // Mandatory field validation
            if (applicantName == null || applicantName.trim().isEmpty() ||
                engineNumber == null || engineNumber.trim().isEmpty() ||
                chassisNumber == null || chassisNumber.trim().isEmpty() ||
                manufacturingYear == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Mandatory fields (Name, Engine, Chassis, Year) are missing."));
            }

            // Basic validation for duplicates
            if (applicationRepository.findAll().stream().anyMatch(a -> 
                engineNumber.equals(a.getEngineNumber()) || chassisNumber.equals(a.getChassisNumber()))) {
                return ResponseEntity.badRequest().body(Map.of("error", "Duplicate engine or chassis number detected."));
            }

            // Resolve user — prefer principal (authenticated user), fallback to userId param
            com.ivtms.entity.User user = null;
            if (principal != null) {
                user = userRepository.findByEmailIgnoreCase(principal.getName()).orElse(null);
            }
            if (user == null && userId != null) {
                user = userRepository.findById(userId).orElse(null);
            }
            if (user == null) {
                log.error("User not found. principal={}, userId={}", principal != null ? principal.getName() : "null", userId);
                return ResponseEntity.badRequest().body(Map.of("error", "User not found. Please re-login and try again."));
            }

            // Store files (each returns null safely if file is null/empty)
            String idUrl = fileStorageService.storeFile(identityProof);
            String addrUrl = fileStorageService.storeFile(addressProof);
            String invUrl = fileStorageService.storeFile(vehicleInvoice);
            String rcUrl = fileStorageService.storeFile(existingRc);
            String insUrl = fileStorageService.storeFile(insuranceDoc);
            String pucUrl = fileStorageService.storeFile(pucDoc);
            String imgUrl = fileStorageService.storeFile(vehicleImage);
            String rcTransUrl = fileStorageService.storeFile(rcTransferDoc);

            // Simulated AI Fraud Risk and Compliance Calculation
            Integer riskScore = 5;
            String compliance = "COMPLIANT";
            
            // Basic rules for demo: if old vehicle, mark as medium risk
            try {
                int year = Integer.parseInt(manufacturingYear);
                if (year < 2015) {
                    riskScore = 45;
                    compliance = "NON_COMPLIANT";
                }
            } catch (Exception e) {
                // Ignore parsing errors
            }

            // Create application
            Application app = Application.builder()
                    .appId("APP-" + System.currentTimeMillis())
                    .applicantName(applicantName)
                    .type("New Registration")
                    .status("PENDING_APPROVAL")
                    .dob(dob)
                    .gender(gender)
                    .city(city)
                    .state(state)
                    .pincode(pincode)
                    .vehicleType(vehicleType)
                    .vehicleCategory(vehicleCategory)
                    .vehicleModel(vehicleModel)
                    .manufacturer(manufacturer)
                    .engineNumber(engineNumber)
                    .chassisNumber(chassisNumber)
                    .fuelType(fuelType)
                    .manufacturingYear(manufacturingYear)
                    .vehicleColor(vehicleColor)
                    .registrationDate(registrationDate)
                    .insuranceDetails(insuranceDetails)
                    .insuranceStatus(insuranceStatus)
                    .insuranceExpiry(insuranceExpiry)
                    .vehicleNumber(vehicleNumber)
                    .pucStatus(pucStatus)
                    .permitStatus(permitStatus)
                    .aadhaarNumber(aadhaarNumber)
                    .phoneNumber(phoneNumber)
                    .address(address)
                    .identityProofUrl(idUrl)
                    .addressProofUrl(addrUrl)
                    .vehicleInvoiceUrl(invUrl)
                    .existingRcUrl(rcUrl)
                    .insuranceDocUrl(insUrl)
                    .pucDocUrl(pucUrl)
                    .vehicleImageUrl(imgUrl)
                    .rcTransferDocUrl(rcTransUrl)
                    .fraudRiskScore(riskScore)
                    .complianceStatus(compliance)
                    .user(user)
                    .build();

            applicationRepository.save(app);
            log.info("Application saved: appId={}", app.getAppId());

            // Notify — sendNotification(user, message, type)
            try {
                notificationService.sendNotification(user,
                    "Your vehicle registration application " + app.getAppId() + " has been submitted for approval.",
                    "APPLICATION_SUBMITTED");
            } catch (Exception ne) {
                log.warn("Notification failed (non-fatal): {}", ne.getMessage());
            }

            return ResponseEntity.ok(Map.of(
                "message", "Application submitted successfully",
                "appId", app.getAppId()
            ));
        } catch (Exception e) {
            log.error("Vehicle registration failed", e);
            return ResponseEntity.status(500).body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/update")
    public ResponseEntity<?> updateApplication(
            @PathVariable Long id,
            @RequestParam(value = "applicantName", required = false) String applicantName,
            @RequestParam(value = "aadhaarNumber", required = false) String aadhaarNumber,
            @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "identityProof", required = false) org.springframework.web.multipart.MultipartFile identityProof,
            @RequestParam(value = "addressProof", required = false) org.springframework.web.multipart.MultipartFile addressProof,
            java.security.Principal principal
    ) {
        try {
            Application app = applicationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Application not found"));

            // Security check
            if (principal == null || !app.getUser().getEmail().equalsIgnoreCase(principal.getName())) {
                return ResponseEntity.status(403).body(Map.of("error", "Unauthorized access"));
            }

            if (applicantName != null) app.setApplicantName(applicantName);
            if (aadhaarNumber != null) app.setAadhaarNumber(aadhaarNumber);
            if (phoneNumber != null) app.setPhoneNumber(phoneNumber);
            if (address != null) app.setAddress(address);

            if (identityProof != null && !identityProof.isEmpty()) {
                app.setIdentityProofUrl(fileStorageService.storeFile(identityProof));
            }
            if (addressProof != null && !addressProof.isEmpty()) {
                app.setAddressProofUrl(fileStorageService.storeFile(addressProof));
            }

            // Reset status to PENDING_APPROVAL after user updates
            app.setStatus("PENDING_APPROVAL");
            app.setRemarks("Updated by applicant");

            applicationRepository.save(app);
            log.info("Application updated and resubmitted: appId={}", app.getAppId());

            return ResponseEntity.ok(Map.of("message", "Application updated and resubmitted successfully"));
        } catch (Exception e) {
            log.error("Update failed", e);
            return ResponseEntity.status(500).body(Map.of("error", "Update failed: " + e.getMessage()));
        }
    }


    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload, 
                                        java.security.Principal principal, jakarta.servlet.http.HttpServletRequest request) {
        String status = payload.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().body("Status is required");
        }

        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        String oldStatus = app.getStatus();
        String remarks = payload.get("remarks");
        
        if ("REJECTED".equals(status) && (remarks == null || remarks.trim().isEmpty())) {
            return ResponseEntity.badRequest().body("Rejection reason (remarks) is mandatory for REJECTED status.");
        }

        app.setStatus(status);
        if (remarks != null) {
            app.setRemarks(remarks);
        }
        
        String regNo = null;
        if ("APPROVED".equals(status) && !"APPROVED".equals(oldStatus)) {
            // Generate Unique Registration Number
            boolean unique = false;
            while (!unique) {
                regNo = "MH-12-" + (char)('A' + (int)(Math.random() * 26)) + (char)('A' + (int)(Math.random() * 26)) + "-" + (1000 + (int)(Math.random() * 9000));
                if (!vehicleRepository.existsByRegistrationNumber(regNo)) {
                    unique = true;
                }
            }
            
            // Create Vehicle
            com.ivtms.entity.Vehicle vehicle = com.ivtms.entity.Vehicle.builder()
                    .registrationNumber(regNo)
                    .manufacturer(app.getManufacturer())
                    .model(app.getVehicleModel())
                    .manufacturingYear(app.getManufacturingYear() != null ? Integer.parseInt(app.getManufacturingYear()) : null)
                    .engineNumber(app.getEngineNumber())
                    .chassisNumber(app.getChassisNumber())
                    .fuelType(app.getFuelType())
                    .owner(app.getUser())
                    .build();
            vehicleRepository.save(vehicle);
            
            notificationService.sendNotification(app.getUser(), "Registration Approved", 
                "Congratulations! Your vehicle registration (" + app.getAppId() + ") has been approved. Your new registration number is " + regNo);
        } else if ("REJECTED".equals(status)) {
            notificationService.sendNotification(app.getUser(), "Registration Rejected", 
                "Your vehicle registration (" + app.getAppId() + ") was rejected. Reason: " + app.getRemarks());
        } else if ("ACTION_REQUIRED".equals(status)) {
            notificationService.sendNotification(app.getUser(), "Clarification Required", 
                "Additional information or clarification is required for your application (" + app.getAppId() + "). Please check the remarks: " + app.getRemarks());
        }

        applicationRepository.save(app);

        // Audit Log
        String actor = principal != null ? principal.getName() : "SYSTEM";
        String ip = request.getRemoteAddr();
        auditLogService.log(actor, "UPDATE_APP_STATUS", "Application:" + app.getAppId(), status, ip, 
            "Status changed from " + oldStatus + " to " + status + (regNo != null ? ". RegNo: " + regNo : "") + ". Remarks: " + remarks);

        return ResponseEntity.ok(Map.of("message", "Application " + id + " status updated to " + status));
    }
}
