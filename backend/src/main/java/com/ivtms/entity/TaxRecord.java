package com.ivtms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "tax_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaxRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String taxType; // e.g., Road Tax, Green Tax
    private Double amountPaid;
    private LocalDate paymentDate;
    private LocalDate validUntil;
    private String receiptNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;
}
