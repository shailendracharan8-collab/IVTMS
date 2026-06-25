package com.ivtms.config;

import com.ivtms.entity.User;
import com.ivtms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createIfMissing("admin@ivtms.gov.in", "111122223333", "System Admin", "ADMIN", System.getenv("ADMIN_PASSWORD") != null ? System.getenv("ADMIN_PASSWORD") : "admin_password");
        createIfMissing("rto@ivtms.gov.in", "222233334444", "RTO Officer", "RTO", System.getenv("RTO_PASSWORD") != null ? System.getenv("RTO_PASSWORD") : "rto_password");
        createIfMissing("inspector@ivtms.gov.in", "333344445555", "PUC Inspector", "INSPECTOR", System.getenv("INSPECTOR_PASSWORD") != null ? System.getenv("INSPECTOR_PASSWORD") : "inspector_password");
        createIfMissing("john@example.com", "444455556666", "John Doe", "CITIZEN", System.getenv("CITIZEN_PASSWORD") != null ? System.getenv("CITIZEN_PASSWORD") : "user_password");
    }

    private void createIfMissing(String email, String aadhaar, String name, String role, String password) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = userRepository.findByAadhaarNumber(aadhaar).orElse(null);
        }

        if (user == null) {
            user = User.builder()
                .fullName(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .aadhaarNumber(aadhaar)
                .role(role)
                .status("Active")
                .build();
            userRepository.save(user);
            System.out.println("Created " + role + " user: " + email);
        } else {
            // Update password in case it was stored as plain text or needs an update
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role); // Ensure role is correct too
            userRepository.save(user);
            System.out.println("Updated " + role + " user password: " + email);
        }
    }
}
