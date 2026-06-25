package com.ivtms.controller;

import com.ivtms.entity.User;
import com.ivtms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/toggle/{email}")
    public ResponseEntity<?> toggleUserStatus(@PathVariable String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String newStatus = "Active".equalsIgnoreCase(user.getStatus()) ? "Inactive" : "Active";
            user.setStatus(newStatus);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "User " + email + " status changed to " + newStatus));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<?> deleteUser(@PathVariable String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            userRepository.delete(userOpt.get());
            return ResponseEntity.ok(Map.of("message", "User " + email + " deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/add")
    public ResponseEntity<?> addUser(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "User already exists"));
        }

        User user = User.builder()
                .fullName(payload.get("fullName"))
                .email(email)
                .aadhaarNumber(payload.get("aadhaarNumber"))
                .role(normalizeRole(payload.getOrDefault("role", "CITIZEN")))
                .password(passwordEncoder.encode(payload.getOrDefault("password", "change_me_default"))) // Default password encoded
                .status("Active")
                .build();

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User " + email + " added successfully"));
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "CITIZEN";
        }

        String normalized = role.trim().toUpperCase(Locale.ROOT).replaceAll("[^A-Z0-9]+", "_");
        while (normalized.startsWith("ROLE_")) {
            normalized = normalized.substring("ROLE_".length());
        }

        return switch (normalized) {
            case "RTO_OFFICER", "OFFICIAL", "GOVT_OFFICIAL", "GOVERNMENT_OFFICIAL" -> "RTO";
            case "SYSTEM_ADMINISTRATOR", "SUPER_ADMIN", "ADMINISTRATOR", "ADMIN_STAFF" -> "ADMIN";
            case "PUC_INSPECTOR" -> "INSPECTOR";
            case "CITIZEN_USER", "USER" -> "CITIZEN";
            default -> normalized;
        };
    }
}
