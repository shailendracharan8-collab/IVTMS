package com.ivtms.dto;

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
public class ClaimDTO {

    @NotBlank(message = "Claim number is required")
    private String claimNumber;

    @NotNull(message = "Claim date is required")
    private LocalDate claimDate;

    @Positive(message = "Claim amount must be positive")
    private Double claimAmount;

    @NotBlank(message = "Description is required")
    private String description;

    private String claimStatus;
    private String vehicleRegistration;
    private String policyNumber;
}
