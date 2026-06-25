package com.ivtms.controller;

import com.ivtms.entity.TaxRecord;
import com.ivtms.service.TaxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tax")
public class TaxController {

    @Autowired
    private TaxService taxService;

    @PostMapping("/pay/{registrationNumber}")
    public ResponseEntity<TaxRecord> payTax(@PathVariable String registrationNumber, @RequestBody TaxRecord taxRecord) {
        return ResponseEntity.ok(taxService.payTax(registrationNumber, taxRecord));
    }

    @GetMapping("/history/{registrationNumber}")
    public ResponseEntity<List<TaxRecord>> getHistory(@PathVariable String registrationNumber) {
        return ResponseEntity.ok(taxService.getTaxHistory(registrationNumber));
    }
}
