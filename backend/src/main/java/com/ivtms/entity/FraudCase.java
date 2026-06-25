package com.ivtms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "fraud_cases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleNo;
    private String flagType;    // Stolen Vehicle, Fake Insurance, Duplicate RC, Other
    private String reportedBy;
    private LocalDateTime reportedDate;
    private String severity;    // High, Medium, Low
    private String status;      // Open, Escalated, Resolved, Blacklisted
    private String description;
    private String remarks;
}
