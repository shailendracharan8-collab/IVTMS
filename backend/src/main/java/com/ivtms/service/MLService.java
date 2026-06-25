package com.ivtms.service;

import com.ivtms.dto.FraudPredictionResponse;
import com.ivtms.entity.InsuranceClaim;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class MLService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${app.ml-service.base-url}")
    private String mlServiceBaseUrl;

    public FraudPredictionResponse predictFraud(InsuranceClaim claim) {
        String url = mlServiceBaseUrl + "/predict/fraud";

        // Prepare request body (Claim data)
        Map<String, Object> request = new HashMap<>();
        request.put("claimNumber", claim.getClaimNumber());
        request.put("amount", claim.getClaimAmount());
        request.put("description", claim.getDescription());
        request.put("policyId", claim.getPolicy().getId());

        try {
            return restTemplate.postForObject(url, request, FraudPredictionResponse.class);
        } catch (Exception e) {
            // Log error and return a default "Unknown" verdict if ML service is down
            return FraudPredictionResponse.builder()
                    .fraudScore(0.0)
                    .verdict("SERVICE_UNAVAILABLE")
                    .details("Error calling ML service: " + e.getMessage())
                    .build();
        }
    }
}
