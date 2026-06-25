package com.ivtms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String registrationNumber;

    private String manufacturer;
    private String model;
    private Integer manufacturingYear;
    private String engineNumber;
    private String chassisNumber;
    private String fuelType;
    private String status; // COMPLIANT, NON_COMPLIANT

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User owner;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private List<InsurancePolicy> insurancePolicies;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private List<PUCCertificate> pucCertificates;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private List<TaxRecord> taxRecords;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private List<Permit> permits;
}
