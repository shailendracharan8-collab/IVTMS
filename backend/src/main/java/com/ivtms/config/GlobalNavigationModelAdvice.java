package com.ivtms.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

/**
 * Common model attributes for Thymeleaf nav (works without {@code #httpServletRequest}/{@code #request} in expressions).
 */
@ControllerAdvice
public class GlobalNavigationModelAdvice {

    /** Current URI for active navbar links */
    @ModelAttribute("requestUri")
    public String requestUri(HttpServletRequest request) {
        String u = request.getRequestURI();
        return u != null ? u : "";
    }

    /** Used by the navbar "Go to Console" link only when the user is authenticated. */
    @ModelAttribute("dashboardHomeUrl")
    public String dashboardHomeUrl() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || isAnonymous(auth)) {
            return "/dashboard/user";
        }
        for (GrantedAuthority ga : auth.getAuthorities()) {
            String a = ga.getAuthority();
            if ("ROLE_ADMIN".equals(a)) {
                return "/dashboard/admin";
            }
            if ("ROLE_RTO".equals(a) || "ROLE_RTO_OFFICER".equals(a)) {
                return "/dashboard/rto";
            }
            if ("ROLE_INSPECTOR".equals(a)) {
                return "/dashboard/inspector";
            }
            if ("ROLE_CITIZEN".equals(a)) {
                return "/dashboard/user";
            }
        }
        return "/dashboard/user";
    }

    private static boolean isAnonymous(Authentication auth) {
        Object principal = auth.getPrincipal();
        return principal instanceof String s && "anonymousUser".equals(s);
    }
}
