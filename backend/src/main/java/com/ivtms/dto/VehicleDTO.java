package com.ivtms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleDTO {
    private Long id;

    @NotBlank(message = "Registration number is required")
    @Size(min = 5, max = 15, message = "Registration number must be between 5 and 15 characters")
    private String registrationNumber;

    @NotBlank(message = "Manufacturer is required")
    private String manufacturer;

    @NotBlank(message = "Model is required")
    private String model;

    @NotNull(message = "Manufacturing year is required")
    private Integer manufacturingYear;

    @NotBlank(message = "Fuel type is required")
    private String fuelType;

    @NotBlank(message = "Owner email is required")
    private String ownerEmail;

    @NotBlank(message = "Engine number is required")
    private String engineNumber;

    @NotBlank(message = "Chassis number is required")
    private String chassisNumber;

    private String ownerName;
    private String vehicleType;

    // Status fields for Dashboard
    private String insuranceStatus;
    private String pucStatus;
    private String taxStatus;
    private java.time.LocalDate insuranceExpiry;
    private java.time.LocalDate pucExpiry;
}
