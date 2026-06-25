package com.ivtms.task;

import com.ivtms.entity.Document;
import com.ivtms.entity.Notification;
import com.ivtms.repository.DocumentRepository;
import com.ivtms.repository.NotificationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@Slf4j
public class ExpiryAlertTask {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private com.ivtms.repository.InsurancePolicyRepository insuranceRepository;

    @Autowired
    private com.ivtms.repository.PUCCertificateRepository pucRepository;

    @Autowired
    private com.ivtms.repository.DocumentRepository documentRepository;

    // Run every day at 00:00 (Midnight)
    // For testing, could be set to run every minute: @Scheduled(fixedRate = 60000)
    @Scheduled(cron = "0 0 0 * * ?")
    public void checkExpiringDocuments() {
        log.info("Running scheduled task to check for expiring documents...");

        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysFromNow = today.plusDays(30);

        List<Document> expiringDocs = documentRepository.findByExpiryDateBetweenAndIsActiveTrue(today, thirtyDaysFromNow);

        log.info("Found {} documents expiring within 30 days.", expiringDocs.size());

        for (Document doc : expiringDocs) {
            if (doc.getOwner() != null) {
                String message = String.format("Your document '%s' (No: %s) is expiring on %s. Please renew it to avoid penalties.",
                        doc.getDocumentType(),
                        doc.getDocumentNumber() != null ? doc.getDocumentNumber() : "N/A",
                        doc.getExpiryDate().toString());
                createNotification(doc.getOwner(), message, doc.getDocumentType().toUpperCase() + "_EXPIRY");
            }
        }

        // Check expiring Insurance Policies
        List<com.ivtms.entity.InsurancePolicy> expiringPolicies = insuranceRepository.findByExpiryDateBetweenAndStatus(today, thirtyDaysFromNow, "VERIFIED");
        log.info("Found {} insurance policies expiring within 30 days.", expiringPolicies.size());
        for (var policy : expiringPolicies) {
            if (policy.getVehicle() != null && policy.getVehicle().getOwner() != null) {
                String message = String.format("Insurance policy %s for vehicle %s is expiring on %s.",
                        policy.getPolicyNumber(),
                        policy.getVehicle().getRegistrationNumber(),
                        policy.getExpiryDate());
                createNotification(policy.getVehicle().getOwner(), message, "INSURANCE_EXPIRY");
            }
        }

        // Check expiring PUC Certificates
        List<com.ivtms.entity.PUCCertificate> expiringPUCs = pucRepository.findByExpiryDateBetweenAndStatus(today, thirtyDaysFromNow, "ACTIVE");
        log.info("Found {} PUC certificates expiring within 30 days.", expiringPUCs.size());
        for (var puc : expiringPUCs) {
            if (puc.getVehicle() != null && puc.getVehicle().getOwner() != null) {
                String message = String.format("PUC Certificate for vehicle %s is expiring on %s.",
                        puc.getVehicle().getRegistrationNumber(),
                        puc.getExpiryDate());
                createNotification(puc.getVehicle().getOwner(), message, "PUC_EXPIRY");
            }
        }
        
        log.info("Scheduled task 'checkExpiringDocuments' completed.");
    }

    private void createNotification(com.ivtms.entity.User user, String message, String type) {
        com.ivtms.entity.Notification notification = com.ivtms.entity.Notification.builder()
                .message(message)
                .type(type)
                .createdAt(LocalDateTime.now())
                .isRead(false)
                .recipient(user)
                .build();
        notificationRepository.save(notification);
        log.debug("Created notification of type {} for user ID: {}", type, user.getId());
    }
}
