package com.ivtms.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDTO {
    private Long id;
    private String appId;
    private String applicantName;
    private String type;
    private String status;
    private String rtoOffice;
    private LocalDateTime submittedAt;
    private String formattedSubmittedAt;
    private String remarks;
    private String rejectionReason;

    // Citizen Details
    private String aadhaarNumber;
    private String phoneNumber;
    private String email; // From User
    private String dob;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String pincode;

    // Vehicle Details
    private String vehicleType;
    private String vehicleCategory;
    private String vehicleModel;
    private String manufacturer;
    private String engineNumber;
    private String chassisNumber;
    private String manufacturingYear;
    private String fuelType;
    private String vehicleColor;
    private String registrationDate;
    private String insuranceStatus;
    private String insuranceExpiry;
    private String vehicleNumber;
    private String pucStatus;
    private String permitStatus;
    private String insuranceDetails;

    // Document URLs
    private String identityProofUrl;
    private String addressProofUrl;
    private String vehicleInvoiceUrl;
    private String existingRcUrl;
    private String insuranceDocUrl;
    private String pucDocUrl;
    private String vehicleImageUrl;
    private String rcTransferDocUrl;

    private Integer fraudRiskScore;
    private String complianceStatus;
    private String requestedDocs;
}
