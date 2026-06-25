package com.ivtms.service;

import com.ivtms.entity.AuditLog;
import com.ivtms.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(String email, String action, String resource, String status, String ip, String details) {
        AuditLog log = AuditLog.builder()
                .userEmail(email)
                .action(action)
                .resource(resource)
                .status(status)
                .ipAddress(ip)
                .details(details)
                .build();
        auditLogRepository.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}
