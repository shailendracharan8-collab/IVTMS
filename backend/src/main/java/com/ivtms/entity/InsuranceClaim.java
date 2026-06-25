package com.ivtms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "insurance_claims")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InsuranceClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String claimNumber;

    private LocalDate claimDate;
    private Double claimAmount;
    private String description;
    private String claimStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id")
    private InsurancePolicy policy;

    // Explicit getters to ensure compilation
    public String getClaimNumber() { return claimNumber; }
    public LocalDate getClaimDate() { return claimDate; }
    public Double getClaimAmount() { return claimAmount; }
    public String getDescription() { return description; }
    public String getClaimStatus() { return claimStatus; }
}
