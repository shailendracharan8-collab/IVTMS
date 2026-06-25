package com.ivtms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 3, max = 100)
    @Column(name = "full_name")
    private String fullName;

    @NotBlank
    @Size(max = 255)
    @Column(name = "password")
    private String password;

    @NotBlank
    @Size(max = 100)
    @Email
    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String aadhaarNumber;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String status = "Active";

    private String address;
    private String phone;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<Vehicle> vehicles;
}
