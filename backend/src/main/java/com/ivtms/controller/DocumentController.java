package com.ivtms.controller;

import com.ivtms.dto.DocumentDTO;
import com.ivtms.entity.User;
import com.ivtms.repository.UserRepository;
import com.ivtms.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            Principal principal,
            @RequestParam("type") String type,
            @RequestParam(value = "number", required = false) String number,
            @RequestParam(value = "vehicleId", required = false) Long vehicleId,
            @RequestParam(value = "provider", required = false) String provider,
            @RequestParam(value = "issueDate", required = false) String issueDateStr,
            @RequestParam(value = "expiryDate", required = false) String expiryDateStr,
            @RequestParam("file") MultipartFile file) {
        
        try {
            User user = userRepository.findByEmailIgnoreCase(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            LocalDate issueDate = issueDateStr != null && !issueDateStr.isEmpty() ? LocalDate.parse(issueDateStr) : null;
            LocalDate expiryDate = expiryDateStr != null && !expiryDateStr.isEmpty() ? LocalDate.parse(expiryDateStr) : null;

            DocumentDTO doc = documentService.uploadDocument(user.getId(), vehicleId, type, number, provider, issueDate, expiryDate, file);
            return ResponseEntity.ok(doc);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<DocumentDTO>> getMyDocuments(Principal principal) {
        User user = userRepository.findByEmailIgnoreCase(principal.getName()).orElseThrow();
        return ResponseEntity.ok(documentService.getUserDocuments(user.getId()));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<DocumentDTO>> getPendingDocuments() {
        return ResponseEntity.ok(documentService.getPendingVerifications());
    }

    @PostMapping("/verify/{id}")
    public ResponseEntity<?> verifyDocument(
            @PathVariable Long id,
            Principal principal,
            @RequestBody Map<String, String> payload) {
        try {
            User officer = userRepository.findByEmailIgnoreCase(principal.getName()).orElseThrow();
            String status = payload.get("status"); // VERIFIED or REJECTED
            String remarks = payload.get("remarks");
            
            DocumentDTO updated = documentService.verifyDocument(id, officer.getId(), status, remarks);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id, Principal principal) {
        try {
            User user = userRepository.findByEmailIgnoreCase(principal.getName()).orElseThrow();
            documentService.deleteDocument(id, user.getId());
            return ResponseEntity.ok(Map.of("message", "Document deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Path file = Paths.get("uploads/documents").resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
}
