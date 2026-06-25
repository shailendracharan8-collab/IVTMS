package com.ivtms.security;

import java.util.Locale;

public class RoleUtils {

    /**
     * Maps any role-like string to a standard internal key: ADMIN, RTO, INSPECTOR, or CITIZEN.
     */
    public static String canonicalize(String raw) {
        if (raw == null || raw.isBlank()) {
            return "CITIZEN";
        }
        
        String n = raw.trim().toUpperCase(Locale.ROOT).replaceAll("[^A-Z0-9]+", "_");
        
        // Strip ROLE_ prefix if present
        while (n.startsWith("ROLE_")) {
            n = n.substring(5);
        }
        
        return switch (n) {
            case "ADMIN", "SYSTEM_ADMINISTRATOR", "SUPER_ADMIN", "ADMINISTRATOR", "ADMIN_STAFF" -> "ADMIN";
            case "RTO", "RTO_OFFICER", "OFFICIAL", "GOVT_OFFICIAL", "GOVERNMENT_OFFICIAL" -> "RTO";
            case "INSPECTOR", "PUC_INSPECTOR" -> "INSPECTOR";
            case "CITIZEN", "CITIZEN_USER", "USER", "INDIVIDUAL" -> "CITIZEN";
            default -> n.length() <= 32 ? n : "CITIZEN";
        };
    }

    /**
     * Standardizes for Spring Security authorities (e.g. ROLE_ADMIN).
     */
    public static String toAuthority(String raw) {
        return "ROLE_" + canonicalize(raw);
    }
    
    /**
     * Returns the dashboard path segment (e.g. "admin" for /dashboard/admin).
     */
    public static String toPathSegment(String raw) {
        String key = canonicalize(raw);
        return switch (key) {
            case "ADMIN" -> "admin";
            case "RTO" -> "rto";
            case "INSPECTOR" -> "inspector";
            case "CITIZEN" -> "user"; // Citizen uses /dashboard/user
            default -> "user";
        };
    }
}
