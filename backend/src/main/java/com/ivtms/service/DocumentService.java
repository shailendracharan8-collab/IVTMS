package com.ivtms.service;

import com.ivtms.dto.DocumentDTO;
import com.ivtms.entity.Document;
import com.ivtms.entity.User;
import com.ivtms.entity.Vehicle;
import com.ivtms.repository.DocumentRepository;
import com.ivtms.repository.UserRepository;
import com.ivtms.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private AuditLogService auditLogService;

    private final String UPLOAD_DIR = "uploads/documents/";

    public DocumentDTO uploadDocument(Long userId, Long vehicleId, String type, String number, String provider, LocalDate issueDate, LocalDate expiryDate, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Vehicle vehicle = vehicleId != null ? vehicleRepository.findById(vehicleId).orElse(null) : null;

        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + filename);
        Files.write(filePath, file.getBytes());

        Document doc = Document.builder()
                .owner(user)
                .vehicle(vehicle)
                .documentType(type)
                .documentNumber(number)
                .provider(provider)
                .issueDate(issueDate)
                .expiryDate(expiryDate)
                .fileUrl(filename)
                .status("PENDING")
                .isActive(true)
                .build();

        Document saved = documentRepository.save(doc);
        
        auditLogService.log(user.getEmail(), "DOCUMENT_UPLOAD", "Document", "SUCCESS", null, "Uploaded new " + type + " document");
        
        return toDTO(saved);
    }

    public List<DocumentDTO> getUserDocuments(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return documentRepository.findByOwnerAndIsActiveTrueOrderByUploadDateDesc(user)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<DocumentDTO> getPendingVerifications() {
        return documentRepository.findByStatusOrderByUploadDateDesc("PENDING")
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public DocumentDTO verifyDocument(Long docId, Long officerId, String status, String remarks) {
        Document doc = documentRepository.findById(docId).orElseThrow(() -> new RuntimeException("Document not found"));
        User officer = userRepository.findById(officerId).orElseThrow(() -> new RuntimeException("Officer not found"));

        doc.setStatus(status);
        doc.setVerifiedBy(officer);
        doc.setRemarks(remarks);
        
        Document saved = documentRepository.save(doc);
        
        auditLogService.log(officer.getEmail(), "DOCUMENT_VERIFY", "Document", "SUCCESS", null, "Verified document " + doc.getId() + " as " + status);
        
        return toDTO(saved);
    }

    public void deleteDocument(Long docId, Long userId) {
        Document doc = documentRepository.findById(docId).orElseThrow();
        if(!doc.getOwner().getId().equals(userId)) throw new RuntimeException("Unauthorized");
        doc.setActive(false);
        documentRepository.save(doc);
    }

    private DocumentDTO toDTO(Document doc) {
        return DocumentDTO.builder()
                .id(doc.getId())
                .ownerId(doc.getOwner() != null ? doc.getOwner().getId() : null)
                .ownerName(doc.getOwner() != null ? doc.getOwner().getFullName() : null)
                .vehicleId(doc.getVehicle() != null ? doc.getVehicle().getId() : null)
                .vehicleRegNumber(doc.getVehicle() != null ? doc.getVehicle().getRegistrationNumber() : null)
                .documentType(doc.getDocumentType())
                .documentNumber(doc.getDocumentNumber())
                .provider(doc.getProvider())
                .uploadDate(doc.getUploadDate())
                .issueDate(doc.getIssueDate())
                .expiryDate(doc.getExpiryDate())
                .status(doc.getStatus())
                .fileUrl(doc.getFileUrl())
                .remarks(doc.getRemarks())
                .isActive(doc.isActive())
                .build();
    }
}
