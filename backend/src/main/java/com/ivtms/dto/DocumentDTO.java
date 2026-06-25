package com.ivtms.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class DocumentDTO {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private Long vehicleId;
    private String vehicleRegNumber;
    private String documentType;
    private String documentNumber;
    private String provider;
    private LocalDateTime uploadDate;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String status;
    private String fileUrl;
    private String remarks;
    private boolean isActive;
}
