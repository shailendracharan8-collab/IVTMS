package com.ivtms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "aqi_readings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AQIReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String location;
    private Integer aqiValue;
    private String primaryPollutant;
    private LocalDateTime timestamp;
    private String category; // e.g., Good, Moderate, Poor
}
