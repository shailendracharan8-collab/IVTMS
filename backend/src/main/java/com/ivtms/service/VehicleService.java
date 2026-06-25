package com.ivtms.service;

import com.ivtms.dto.VehicleDTO;
import com.ivtms.entity.User;
import com.ivtms.entity.Vehicle;
import com.ivtms.exception.BadRequestException;
import com.ivtms.exception.ResourceNotFoundException;
import com.ivtms.repository.UserRepository;
import com.ivtms.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public VehicleDTO registerVehicle(VehicleDTO vehicleDTO) {
        if (vehicleRepository.existsByRegistrationNumber(vehicleDTO.getRegistrationNumber())) {
            throw new BadRequestException("Vehicle with registration number " + vehicleDTO.getRegistrationNumber() + " already exists.");
        }

        User owner = userRepository.findByEmail(vehicleDTO.getOwnerEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + vehicleDTO.getOwnerEmail()));

        Vehicle vehicle = Vehicle.builder()
                .registrationNumber(vehicleDTO.getRegistrationNumber())
                .manufacturer(vehicleDTO.getManufacturer())
                .model(vehicleDTO.getModel())
                .manufacturingYear(vehicleDTO.getManufacturingYear())
                .fuelType(vehicleDTO.getFuelType())
                .engineNumber(vehicleDTO.getEngineNumber())
                .chassisNumber(vehicleDTO.getChassisNumber())
                .owner(owner)
                .build();

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return mapToDTO(savedVehicle);
    }

    public VehicleDTO getVehicleByRegistrationNumber(String registrationNumber) {
        Vehicle vehicle = vehicleRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with registration number: " + registrationNumber));
        return mapToDTO(vehicle);
    }

    public List<VehicleDTO> getVehiclesByOwner(String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        return vehicleRepository.findByOwnerId(owner.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public VehicleDTO linkVehicleToUser(Long userId, String rc, String chassis) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Vehicle vehicle = vehicleRepository.findByRegistrationNumber(rc.toUpperCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with RC: " + rc));

        // Check if vehicle already has an owner
        if (vehicle.getOwner() != null) {
            if (vehicle.getOwner().getId().equals(userId)) {
                throw new BadRequestException("This vehicle is already linked to your account.");
            } else {
                throw new BadRequestException("This vehicle is already registered to another user. Please contact RTO for transfer.");
            }
        }

        // Verify chassis number (case-insensitive check for the last part)
        String storedChassis = vehicle.getChassisNumber();
        if (storedChassis != null && !storedChassis.toUpperCase().endsWith(chassis.toUpperCase().trim())) {
            throw new BadRequestException("Invalid chassis number verification. Please check the last 6 digits of your chassis.");
        }

        vehicle.setOwner(user);
        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return mapToDTO(updatedVehicle);
    }

    private VehicleDTO mapToDTO(Vehicle vehicle) {
        VehicleDTO.VehicleDTOBuilder builder = VehicleDTO.builder()
                .id(vehicle.getId())
                .registrationNumber(vehicle.getRegistrationNumber())
                .manufacturer(vehicle.getManufacturer())
                .model(vehicle.getModel())
                .manufacturingYear(vehicle.getManufacturingYear())
                .fuelType(vehicle.getFuelType())
                .engineNumber(vehicle.getEngineNumber())
                .chassisNumber(vehicle.getChassisNumber())
                .ownerEmail(vehicle.getOwner() != null ? vehicle.getOwner().getEmail() : null)
                .ownerName(vehicle.getOwner() != null ? vehicle.getOwner().getFullName() : "N/A")
                .vehicleType(vehicle.getFuelType());

        // Compute Insurance Status
        if (vehicle.getInsurancePolicies() != null && !vehicle.getInsurancePolicies().isEmpty()) {
            com.ivtms.entity.InsurancePolicy latestPolicy = vehicle.getInsurancePolicies().stream()
                    .max(java.util.Comparator.comparing(com.ivtms.entity.InsurancePolicy::getExpiryDate))
                    .orElse(null);
            if (latestPolicy != null) {
                builder.insuranceStatus(latestPolicy.getExpiryDate().isAfter(java.time.LocalDate.now()) ? "Active" : "Expired");
                builder.insuranceExpiry(latestPolicy.getExpiryDate());
            }
        } else {
            builder.insuranceStatus("No Policy");
        }

        // Compute PUC Status
        if (vehicle.getPucCertificates() != null && !vehicle.getPucCertificates().isEmpty()) {
            com.ivtms.entity.PUCCertificate latestPuc = vehicle.getPucCertificates().stream()
                    .max(java.util.Comparator.comparing(com.ivtms.entity.PUCCertificate::getExpiryDate))
                    .orElse(null);
            if (latestPuc != null) {
                builder.pucStatus(latestPuc.getExpiryDate().isAfter(java.time.LocalDate.now()) ? "Valid" : "Expired");
                builder.pucExpiry(latestPuc.getExpiryDate());
            }
        } else {
            builder.pucStatus("No Certificate");
        }

        // Compute Tax Status
        if (vehicle.getTaxRecords() != null && !vehicle.getTaxRecords().isEmpty()) {
            com.ivtms.entity.TaxRecord latestTax = vehicle.getTaxRecords().stream()
                    .max(java.util.Comparator.comparing(com.ivtms.entity.TaxRecord::getValidUntil))
                    .orElse(null);
            if (latestTax != null) {
                builder.taxStatus(latestTax.getValidUntil().isAfter(java.time.LocalDate.now()) ? "Paid" : "Pending");
            }
        } else {
            builder.taxStatus("Pending");
        }

        return builder.build();
    }
}
