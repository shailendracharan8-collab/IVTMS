package com.ivtms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "puc_certificates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PUCCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String certificateNumber;

    private LocalDate testDate;
    private LocalDate expiryDate;
    private Double carbonMonoxideLevel;
    private Double hydrocarbonLevel;
    private Double particulateMatterLevel;
    private Double nitrogenOxideLevel;
    private String centerName;
    private String result; // PASS, FAIL
    private String aqiZone;
    private String status; // ACTIVE, EXPIRED, NON_COMPLIANT

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inspector_id")
    private User inspector;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;
}
