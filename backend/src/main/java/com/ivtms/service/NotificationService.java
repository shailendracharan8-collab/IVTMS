package com.ivtms.service;

import com.ivtms.entity.Notification;
import com.ivtms.entity.User;
import com.ivtms.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public void sendNotification(User recipient, String message, String type) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .message(message)
                .type(type)
                .createdAt(LocalDateTime.now())
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    public List<Notification> getNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }
}
