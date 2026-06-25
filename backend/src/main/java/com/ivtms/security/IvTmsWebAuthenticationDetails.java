package com.ivtms.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.web.authentication.WebAuthenticationDetails;

/**
 * Holds the "Login As" dropdown value at credential check time, when the servlet request
 * still contains the {@code role} form field.
 */
public class IvTmsWebAuthenticationDetails extends WebAuthenticationDetails {

    private final String loginAsRole;

    public IvTmsWebAuthenticationDetails(HttpServletRequest request) {
        super(request);
        String r = request.getParameter("role");
        this.loginAsRole = (r != null && !r.isBlank()) ? r.trim() : null;
        org.slf4j.LoggerFactory.getLogger(IvTmsWebAuthenticationDetails.class)
                .info("Captured role from request: {}", this.loginAsRole);
    }

    public String getLoginAsRole() {
        return loginAsRole;
    }
}
