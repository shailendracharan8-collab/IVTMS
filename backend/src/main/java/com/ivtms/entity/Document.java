package com.ivtms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    // Optional: Only set if the document is linked to a specific vehicle
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @Column(nullable = false)
    private String documentType; // e.g. AADHAAR, DL, RC, INSURANCE, PUC, INVOICE, PERMIT, NOC, CHALLAN

    private String documentNumber;

    private String provider;

    @Column(nullable = false)
    private LocalDateTime uploadDate;

    private LocalDate issueDate;
    
    private LocalDate expiryDate;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING"; // PENDING, VERIFIED, REJECTED, EXPIRED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by")
    private User verifiedBy;

    @Column(nullable = false)
    private String fileUrl;

    private String remarks;
    
    @Builder.Default
    private boolean isActive = true;

    @PrePersist
    protected void onCreate() {
        if (uploadDate == null) {
            uploadDate = LocalDateTime.now();
        }
    }
}
