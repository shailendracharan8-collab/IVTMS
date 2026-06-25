package com.ivtms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudPredictionResponse {
    private Double fraudScore;
    private String verdict;
    private String details;
}
