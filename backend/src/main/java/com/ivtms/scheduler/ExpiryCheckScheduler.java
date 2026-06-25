package com.ivtms.scheduler;

import com.ivtms.entity.*;
import com.ivtms.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@Slf4j
public class ExpiryCheckScheduler {

    @Autowired
    private InsurancePolicyRepository policyRepository;

    @Autowired
    private PUCCertificateRepository pucRepository;

    @Autowired
    private TaxRecordRepository taxRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Scheduled(cron = "${app.scheduler.cron}")
    @Transactional
    public void checkExpiries() {
        log.info("Starting daily expiry check at: {}", LocalDateTime.now());
        LocalDate today = LocalDate.now();

        checkInsuranceExpiries(today);
        checkPUCExpiries(today);
        checkTaxExpiries(today);

        log.info("Expiry check completed.");
    }

    private void checkInsuranceExpiries(LocalDate today) {
        List<InsurancePolicy> expiredPolicies = policyRepository.findAll().stream()
                .filter(p -> p.getExpiryDate().isBefore(today) && !"EXPIRED".equals(p.getStatus()))
                .toList();

        for (InsurancePolicy policy : expiredPolicies) {
            policy.setStatus("EXPIRED");
            policyRepository.save(policy);
            createNotification(policy.getVehicle().getOwner(), 
                    "Your insurance policy " + policy.getPolicyNumber() + " has expired.", 
                    "INSURANCE_EXPIRY");
        }
    }

    private void checkPUCExpiries(LocalDate today) {
        List<PUCCertificate> expiredPUCs = pucRepository.findAll().stream()
                .filter(p -> p.getExpiryDate().isBefore(today) && !"EXPIRED".equals(p.getStatus()))
                .toList();

        for (PUCCertificate puc : expiredPUCs) {
            puc.setStatus("EXPIRED");
            pucRepository.save(puc);
            createNotification(puc.getVehicle().getOwner(), 
                    "Your PUC certificate " + puc.getCertificateNumber() + " has expired.", 
                    "PUC_EXPIRY");
        }
    }

    private void checkTaxExpiries(LocalDate today) {
        List<TaxRecord> expiredTaxes = taxRepository.findAll().stream()
                .filter(p -> p.getValidUntil().isBefore(today))
                .toList();

        for (TaxRecord tax : expiredTaxes) {
            createNotification(tax.getVehicle().getOwner(), 
                    "Your " + tax.getTaxType() + " for vehicle " + tax.getVehicle().getRegistrationNumber() + " has expired.", 
                    "TAX_EXPIRY");
        }
    }

    private void createNotification(User recipient, String message, String type) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .message(message)
                .type(type)
                .createdAt(LocalDateTime.now())
                .isRead(false)
                .build();
        notificationRepository.save(notification);
        log.info("Notification created for {}: {}", recipient.getEmail(), message);
    }
}
