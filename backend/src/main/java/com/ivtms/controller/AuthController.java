package com.ivtms.controller;

import com.ivtms.entity.Application;
import com.ivtms.entity.User;
import com.ivtms.repository.ApplicationRepository;
import com.ivtms.repository.UserRepository;
import com.ivtms.security.RoleUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Locale;

@Controller
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ApplicationRepository applicationRepository;

    @PostMapping("/register")
    public String registerUser(@RequestParam(required = false) String fullName, 
                               @RequestParam String password, 
                               @RequestParam String email, 
                               @RequestParam String aadhaarNumber,
                               @RequestParam(defaultValue = "CITIZEN") String role,
                                RedirectAttributes redirectAttributes) {
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        String normalizedAadhaar = aadhaarNumber.trim();
        
        if (userRepository.existsByEmail(normalizedEmail)) {
            redirectAttributes.addAttribute("error", "Email already registered");
            return "redirect:/register";
        }

        if (userRepository.existsByAadhaarNumber(normalizedAadhaar)) {
            redirectAttributes.addAttribute("error", "Aadhaar number already registered");
            return "redirect:/register";
        }

        User user = User.builder()
                .fullName(displayName(fullName, normalizedEmail))
                .password(passwordEncoder.encode(password))
                .email(normalizedEmail)
                .aadhaarNumber(normalizedAadhaar)
                .role(RoleUtils.canonicalize(role))
                .status("Active")
                .build();

        userRepository.save(user);

        // Automatically create a 'New Registration' application for CITIZEN users
        if ("CITIZEN".equals(user.getRole())) {
            Application application = Application.builder()
                    .appId("REG-" + System.currentTimeMillis() % 1000000)
                    .applicantName(user.getFullName())
                    .type("New User Registration")
                    .status("Pending")
                    .rtoOffice("Central RTO")
                    .remarks("Email: " + user.getEmail() + " | Aadhaar: " + user.getAadhaarNumber())
                    .build();
            applicationRepository.save(application);
        }

        return "redirect:/login?success=Registered successfully";
    }

    private String displayName(String fullName, String email) {
        if (fullName == null || fullName.isBlank()) {
            return email;
        }
        return fullName.trim().replaceAll("\\s+", " ");
    }
}
