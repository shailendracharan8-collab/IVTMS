package com.ivtms.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InsuranceDTO {
    
    @NotBlank(message = "Policy number is required")
    private String policyNumber;

    @NotBlank(message = "Insurance provider is required")
    private String insuranceProvider;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "Expiry date is required")
    @Future(message = "Expiry date must be in the future")
    private LocalDate expiryDate;

    @Positive(message = "Premium amount must be positive")
    private Double premiumAmount;

    @Positive(message = "Coverage amount must be positive")
    private Double coverageAmount;

    private String policyType;
    private String claimHistory;
    private String documentPath;
    private String status;
    private String rejectionReason;
    private String vehicleRegistration;
    private String vehicleInfo;
}
