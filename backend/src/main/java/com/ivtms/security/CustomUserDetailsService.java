package com.ivtms.security;

import com.ivtms.entity.User;
import com.ivtms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Locale;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        String normalizedIdentifier = identifier.trim().toLowerCase(Locale.ROOT);
        logger.info("Attempting login lookup for identifier: [{}]", normalizedIdentifier);

        User user;
        if (normalizedIdentifier.matches("\\d{12}")) {
            user = userRepository.findByAadhaarNumber(normalizedIdentifier)
                    .orElseThrow(() -> {
                        logger.warn("User not found with Aadhaar: {}", normalizedIdentifier);
                        return new UsernameNotFoundException("User not found with Aadhaar: " + normalizedIdentifier);
                    });
        } else {
            user = userRepository.findByEmail(normalizedIdentifier)
                    .orElseThrow(() -> {
                        logger.warn("User not found with email: {}", normalizedIdentifier);
                        return new UsernameNotFoundException("User not found with email: " + normalizedIdentifier);
                    });
        }

        logger.info("User found: {} with database role: {}", user.getEmail(), user.getRole());
        
        // Debug: Check if authorities are generated correctly
        String authority = RoleUtils.toAuthority(user.getRole());
        logger.info("DEBUG USERDETAILS: Email='{}', DBRole='{}', GeneratedAuthority='{}', PasswordInDB='{}'", 
                     user.getEmail(), user.getRole(), authority, user.getPassword());

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(authority))
        );
    }
}
