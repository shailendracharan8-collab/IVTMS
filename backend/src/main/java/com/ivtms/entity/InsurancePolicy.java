package com.ivtms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "insurance_policies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InsurancePolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String policyNumber;

    private String policyType;
    private String insuranceProvider;
    private LocalDate startDate;
    private LocalDate expiryDate;
    private Double premiumAmount;
    private Double coverageAmount;
    private String claimHistory;
    private String documentPath;
    private String status; // PENDING_VERIFICATION, VERIFIED, EXPIRED, REJECTED
    private String rejectionReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL)
    private List<InsuranceClaim> claims;
}
