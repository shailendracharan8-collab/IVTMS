package com.ivtms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "puc_appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PUCAppointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String registrationNumber;
    private String centerName;
    private LocalDate appointmentDate;
    private String timeSlot;
    private String status; // SCHEDULED, COMPLETED, CANCELLED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
