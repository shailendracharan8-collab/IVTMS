package com.ivtms.controller;

import com.ivtms.entity.Application;
import com.ivtms.entity.PUCCertificate;
import com.ivtms.entity.User;
import com.ivtms.repository.*;
import com.ivtms.security.RoleUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.security.Principal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;

@Controller
public class HomeController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private PermitRepository permitRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private FraudCaseRepository fraudCaseRepository;

    @Autowired
    private TaxRecordRepository taxRecordRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private com.ivtms.service.AuditLogService auditLogService;

    @Autowired
    private InsurancePolicyRepository insuranceRepository;

    @Autowired
    private PUCCertificateRepository pucRepository;

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/home")
    public String home() {
        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @GetMapping("/about")
    public String about() {
        return "about";
    }

    @GetMapping("/contact")
    public String contact() {
        return "contact";
    }

    @GetMapping("/services")
    public String services() {
        return "services";
    }

    @GetMapping("/vehicle-registration")
    public String vehicleRegistration() {
        return "vehicle-registration";
    }

    @GetMapping("/insurance-tracking")
    public String insuranceTracking() {
        return "insurance-tracking";
    }

    @GetMapping("/puc-eco-status")
    public String pucEcoStatus() {
        return "puc-eco-status";
    }

    @GetMapping("/road-tax")
    public String roadTax() {
        return "road-tax";
    }

    @Autowired
    private com.ivtms.service.InsuranceService insuranceService;

    @Autowired
    private com.ivtms.service.PUCService pucService;

    @GetMapping("/insurance-mgmt")
    public String insuranceMgmt(Model model, Principal principal) {
        if (principal == null) return "redirect:/login";
        User user = userRepository.findByEmailIgnoreCase(principal.getName()).orElse(null);
        if (user == null) return "redirect:/login";
        
        model.addAttribute("user", user);
        var vehicles = vehicleService.getVehiclesByOwner(user.getEmail());
        model.addAttribute("vehicles", vehicles);
        
        var policies = insuranceService.getCitizenPolicies(user.getEmail());
        model.addAttribute("policies", policies);
        
        var claims = insuranceService.getCitizenClaims(user.getEmail());
        model.addAttribute("claims", claims);
        
        return "insurance-mgmt";
    }

    @GetMapping("/puc-mgmt")
    public String pucMgmt(Model model, Principal principal) {
        if (principal == null) return "redirect:/login";
        User user = userRepository.findByEmailIgnoreCase(principal.getName()).orElse(null);
        if (user == null) return "redirect:/login";
        
        model.addAttribute("user", user);
        var vehicles = vehicleService.getVehiclesByOwner(user.getEmail());
        model.addAttribute("vehicles", vehicles);
        
        // Fetch PUC history for all vehicles
        java.util.List<com.ivtms.entity.PUCCertificate> allCerts = new java.util.ArrayList<>();
        for (var v : vehicles) {
            allCerts.addAll(pucService.getPUCHistory(v.getRegistrationNumber()));
        }
        model.addAttribute("certificates", allCerts);
        model.addAttribute("appointments", pucService.getUserAppointments(user.getEmail()));
        
        return "puc-mgmt";
    }

    @GetMapping("/dashboard/admin")
    public String adminDashboard(Model model, Principal principal) {
        if (principal == null) return "redirect:/login";
        User user = userRepository.findByEmailIgnoreCase(principal.getName()).orElse(null);
        if (user == null) return "redirect:/login";
        if (!"admin".equals(RoleUtils.toPathSegment(user.getRole()))) {
            return "redirect:/dashboard/" + RoleUtils.toPathSegment(user.getRole());
        }
        
        model.addAttribute("user", user);
        model.addAttribute("totalVehicles", vehicleRepository.count());
        model.addAttribute("totalCitizens", userRepository.countByRole("CITIZEN"));
        model.addAttribute("pendingApplications", applicationRepository.countByStatus("PENDING_APPROVAL"));
        model.addAttribute("pendingFraud", fraudCaseRepository.countByStatus("Open"));
        model.addAttribute("allUsers", userRepository.findAll());
        model.addAttribute("systemLogs", auditLogService.getAllLogs());
        
        double totalRevenue = taxRecordRepository.findAll().stream()
                .mapToDouble(tr -> tr.getAmountPaid() != null ? tr.getAmountPaid() : 0.0)
                .sum();
        model.addAttribute("totalRevenue", String.format("%.2f", totalRevenue));

        return "dashboard-admin";
    }

    @Autowired
    private com.ivtms.service.VehicleService vehicleService;

    @Autowired
    private com.ivtms.service.DocumentService documentService;

    @Autowired
    private com.ivtms.service.NotificationService notificationService;

    @GetMapping("/dashboard/user")
    public String userDashboard(Model model, Principal principal) {
        if (principal == null) return "redirect:/login";
        User user = userRepository.findByEmailIgnoreCase(principal.getName()).orElse(null);
        if (user == null) return "redirect:/login";
        if (!"user".equals(RoleUtils.toPathSegment(user.getRole()))) {
            return "redirect:/dashboard/" + RoleUtils.toPathSegment(user.getRole());
        }

        model.addAttribute("user", user);
        model.addAttribute("section", "overview");
        try {
            var vehicles = vehicleService.getVehiclesByOwner(user.getEmail());
            model.addAttribute("vehicles", vehicles);
            
            // Get user's applications
            List<Application> applications = applicationRepository.findByUser(user);
            applications.sort(Comparator.comparing(Application::getSubmittedAt, Comparator.nullsLast(Comparator.reverseOrder())));
            model.addAttribute("applications", applications);
            
            java.util.List<com.ivtms.entity.Permit> permits = new java.util.ArrayList<>();
            java.util.List<com.ivtms.entity.TaxRecord> taxes = new java.util.ArrayList<>();
            
            for (com.ivtms.dto.VehicleDTO v : vehicles) {
                permits.addAll(permitRepository.findByVehicleId(v.getId()));
                taxes.addAll(taxRecordRepository.findByVehicleId(v.getId()));
            }
            
            model.addAttribute("permits", permits);
            model.addAttribute("taxes", taxes);

            // Get user's documents
            var documents = documentService.getUserDocuments(user.getId());
            model.addAttribute("documents", documents);
            
            // Summary stats
            long activeInsurances = insuranceRepository.findByVehicle_Owner_EmailIgnoreCase(user.getEmail()).stream()
                    .filter(p -> "VERIFIED".equals(p.getStatus()) && p.getExpiryDate().isAfter(java.time.LocalDate.now()))
                    .count();
            
            long validPUC = vehicles.stream()
                    .map(v -> pucRepository.findTopByVehicleIdOrderByTestDateDesc(v.getId()))
                    .filter(java.util.Optional::isPresent)
                    .map(java.util.Optional::get)
                    .filter(p -> "ACTIVE".equals(p.getStatus()) && p.getExpiryDate().isAfter(java.time.LocalDate.now()))
                    .count();

            model.addAttribute("activeInsurances", activeInsurances);
            model.addAttribute("validPUC", validPUC);
            
            // Add notifications
            model.addAttribute("notifications", notificationService.getNotifications(user.getId()));
            
        } catch (Exception e) {
            model.addAttribute("vehicles", java.util.Collections.emptyList());
            model.addAttribute("applications", java.util.Collections.emptyList());
            model.addAttribute("permits", java.util.Collections.emptyList());
            model.addAttribute("taxes", java.util.Collections.emptyList());
            model.addAttribute("error", "Could not fetch dashboard data: " + e.getMessage());
        }
        
        return "dashboard-user";
    }

    @Autowired
    private com.ivtms.service.ComplianceService complianceService;

    @GetMapping("/dashboard/rto")
    public String rtoDashboard(Model model, Principal principal) {
        if (principal == null) return "redirect:/login";
        User user = userRepository.findByEmailIgnoreCase(principal.getName()).orElse(null);
        if (user == null) return "redirect:/login";
        if (!"rto".equals(RoleUtils.toPathSegment(user.getRole()))) {
            return "redirect:/dashboard/" + RoleUtils.toPathSegment(user.getRole());
        }

        model.addAttribute("user", user);
        model.addAttribute("pendingCount", applicationRepository.countByStatus("PENDING_APPROVAL"));
        model.addAttribute("approvedCount", applicationRepository.countByStatus("APPROVED"));
        model.addAttribute("rejectedCount", applicationRepository.countByStatus("REJECTED"));
        model.addAttribute("actionRequiredCount", applicationRepository.countByStatus("ACTION_REQUIRED"));
        model.addAttribute("allApplications", applicationRepository.findAll());
        model.addAttribute("pendingApplications", applicationRepository.findByStatusIn(java.util.Arrays.asList("PENDING_APPROVAL", "ACTION_REQUIRED")));
        model.addAttribute("allFraudCases", fraudCaseRepository.findAll());
        model.addAttribute("allVehicles", vehicleRepository.findAll());
        model.addAttribute("permits", permitRepository.findAll());
        model.addAttribute("allAuditLogs", auditLogRepository.findAllByOrderByTimestampDesc());
        model.addAttribute("pendingInsurances", insuranceService.getPendingPolicies());
        
        // Fraud Analytics
        List<com.ivtms.entity.FraudCase> allCases = fraudCaseRepository.findAll();
        model.addAttribute("openFraudCount", allCases.stream().filter(c -> "Open".equalsIgnoreCase(c.getStatus())).count());
        model.addAttribute("escalatedFraudCount", allCases.stream().filter(c -> "Escalated".equalsIgnoreCase(c.getStatus())).count());
        model.addAttribute("resolvedFraudCount", allCases.stream().filter(c -> "Resolved".equalsIgnoreCase(c.getStatus())).count());
        model.addAttribute("blacklistedFraudCount", allCases.stream().filter(c -> "Blacklisted".equalsIgnoreCase(c.getStatus())).count());
        
        // Fraud Category Analytics (for Chart)
        model.addAttribute("stolenCount", allCases.stream().filter(c -> "Stolen Vehicle".equalsIgnoreCase(c.getFlagType())).count());
        model.addAttribute("fakeInsuranceCount", allCases.stream().filter(c -> "Fake Insurance".equalsIgnoreCase(c.getFlagType())).count());
        model.addAttribute("duplicateRCCount", allCases.stream().filter(c -> "Duplicate RC".equalsIgnoreCase(c.getFlagType())).count());
        model.addAttribute("otherFraudCount", allCases.stream().filter(c -> "Other".equalsIgnoreCase(c.getFlagType())).count());

        // Compliance Analytics
        model.addAttribute("compliance", complianceService.getGlobalComplianceMetrics());

        double totalRevenue = taxRecordRepository.findAll().stream()
                .mapToDouble(tr -> tr.getAmountPaid() != null ? tr.getAmountPaid() : 0.0)
                .sum();
        model.addAttribute("totalRevenue", totalRevenue);
        
        return "dashboard-rto";
    }


    @Autowired
    private PUCCertificateRepository pucCertificateRepository;

    @Transactional(readOnly = true)
    @GetMapping("/dashboard/inspector")
    public String inspectorDashboard(Model model, Principal principal) {
        if (principal == null) return "redirect:/login";
        User user = userRepository.findByEmailIgnoreCase(principal.getName()).orElse(null);
        if (user == null) return "redirect:/login";
        if (!"inspector".equals(RoleUtils.toPathSegment(user.getRole()))) {
            return "redirect:/dashboard/" + RoleUtils.toPathSegment(user.getRole());
        }

        model.addAttribute("user", user);
        model.addAttribute("inspectorCenterId", "MH-12-0045");

        List<PUCCertificate> allCerts = pucCertificateRepository.findAll();
        long totalTests = allCerts.size();
        long passedTests = allCerts.stream().filter(c -> "PASS".equalsIgnoreCase(c.getStatus())).count();
        long failedTests = totalTests - passedTests;
        LocalDate today = LocalDate.now();
        YearMonth thisMonth = YearMonth.now();
        long testsToday = allCerts.stream().filter(c -> today.equals(c.getTestDate())).count();
        long certificatesThisMonth = allCerts.stream()
                .filter(c -> c.getTestDate() != null && YearMonth.from(c.getTestDate()).equals(thisMonth))
                .count();
        String systemHealthPct = totalTests == 0 ? "100.0" : String.format("%.1f", (passedTests * 100.0 / totalTests));

        List<PUCCertificate> recentSorted = allCerts.stream()
                .sorted(Comparator
                        .comparing(PUCCertificate::getTestDate, Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(Comparator.comparing(PUCCertificate::getId).reversed()))
                .toList();
        List<PUCCertificate> recentPreview = recentSorted.stream().limit(8).toList();

        model.addAttribute("totalTests", totalTests);
        model.addAttribute("passRate", totalTests > 0 ? (passedTests * 100 / totalTests) + "%" : "0%");
        model.addAttribute("failedToday", failedTests);
        model.addAttribute("recentCerts", recentSorted);
        model.addAttribute("recentSessionsPreview", recentPreview);
        model.addAttribute("testsToday", testsToday);
        model.addAttribute("compliantCount", passedTests);
        model.addAttribute("violationCount", failedTests);
        model.addAttribute("certificatesThisMonth", certificatesThisMonth);
        model.addAttribute("systemHealthPct", systemHealthPct);

        return "dashboard-inspector";
    }
}
