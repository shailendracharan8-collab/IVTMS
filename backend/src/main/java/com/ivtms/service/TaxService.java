package com.ivtms.service;

import com.ivtms.entity.TaxRecord;
import com.ivtms.entity.Vehicle;
import com.ivtms.exception.ResourceNotFoundException;
import com.ivtms.repository.TaxRecordRepository;
import com.ivtms.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaxService {

    @Autowired
    private TaxRecordRepository taxRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Transactional
    public TaxRecord payTax(String registrationNumber, TaxRecord taxRecord) {
        Vehicle vehicle = vehicleRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with registration number: " + registrationNumber));
        taxRecord.setVehicle(vehicle);
        return taxRepository.save(taxRecord);
    }

    public List<TaxRecord> getTaxHistory(String registrationNumber) {
        Vehicle vehicle = vehicleRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with registration number: " + registrationNumber));
        return taxRepository.findByVehicleId(vehicle.getId());
    }
}
