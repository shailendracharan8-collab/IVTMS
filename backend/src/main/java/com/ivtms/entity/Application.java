package com.ivtms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String appId;

    @Column(nullable = false)
    private String applicantName;

    @Column(nullable = false)
    private String type; // New Registration, Ownership Transfer, etc.

    @Builder.Default
    @Column(nullable = false)
    private String status = "PENDING_APPROVAL"; // PENDING_APPROVAL, APPROVED, REJECTED, ACTION_REQUIRED

    @Builder.Default
    private String rtoOffice = "Pune RTO";

    private LocalDateTime submittedAt;
    
    private String remarks;
    private String rejectionReason;

    private String aadhaarNumber;
    private String phoneNumber;
    private String dob;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String pincode;

    // Vehicle Details
    private String vehicleType;
    private String vehicleCategory; // e.g. Transport, Non-Transport
    private String vehicleModel;
    private String manufacturer;
    private String engineNumber;
    private String chassisNumber;
    private String manufacturingYear;
    private String fuelType;
    private String vehicleColor;
    private String registrationDate;
    private String insuranceStatus; // Valid/Expired
    private String insuranceExpiry;
    private String vehicleNumber;
    private String pucStatus;
    private String permitStatus;
    private String insuranceDetails;

    // Document URLs (Filenames or paths)
    private String identityProofUrl;
    private String addressProofUrl;
    private String vehicleInvoiceUrl;
    private String existingRcUrl;
    private String insuranceDocUrl;
    private String pucDocUrl;
    private String vehicleImageUrl;
    private String rcTransferDocUrl;

    private Integer fraudRiskScore; // percentage 0-100
    private String complianceStatus; // e.g. "Valid", "Warning"
    
    @Column(length = 1000)
    private String requestedDocs; // Comma separated list of doc IDs needing re-upload

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @PrePersist
    protected void onCreate() {
        if (submittedAt == null) {
            submittedAt = LocalDateTime.now();
        }
    }
}
