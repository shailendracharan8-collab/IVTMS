package com.ivtms.repository;

import com.ivtms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByAadhaarNumber(String aadhaarNumber);
    Boolean existsByEmail(String email);
    Boolean existsByAadhaarNumber(String aadhaarNumber);
    long countByRole(String role);
}
