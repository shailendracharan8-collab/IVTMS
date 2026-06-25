package com.ivtms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "permits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String permitType; // e.g., National Permit, State Permit
    private String permitNumber;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String areaOfOperation;
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;
}
