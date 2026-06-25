package com.ivtms.config;

import com.ivtms.entity.User;
import com.ivtms.repository.UserRepository;
import com.ivtms.security.IvTmsWebAuthenticationDetails;
import com.ivtms.security.LoginSelectedRoleCaptureFilter;
import com.ivtms.security.RoleUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private static final Logger logger = LoggerFactory.getLogger(CustomAuthenticationSuccessHandler.class);

    private final SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        String username = authentication.getName();
        Set<String> authorities = AuthorityUtils.authorityListToSet(authentication.getAuthorities());
        
        logger.info("User '{}' authenticated successfully. Authorities: {}", username, authorities);

        // 1. Capture the selected role from various possible sources
        String selectedRole = request.getParameter("role");
        
        if (selectedRole == null || selectedRole.isBlank()) {
            if (authentication.getDetails() instanceof IvTmsWebAuthenticationDetails d) {
                selectedRole = d.getLoginAsRole();
                if (selectedRole != null) logger.info("Found role in AuthenticationDetails: {}", selectedRole);
            }
        }
        
        if (selectedRole == null || selectedRole.isBlank()) {
            selectedRole = consumeStoredLoginRole(request);
            if (selectedRole != null) logger.info("Found role in Session: {}", selectedRole);
        }

        // 2. Validate the selected role against actual user authorities
        if (selectedRole != null && !selectedRole.isBlank()) {
            String canonicalSelected = RoleUtils.canonicalize(selectedRole);
            String requiredAuth = RoleUtils.toAuthority(canonicalSelected);

            logger.info("Verifying role: Selected='{}', Canonical='{}', RequiredAuth='{}', UserAuths={}", 
                         selectedRole, canonicalSelected, requiredAuth, authorities);

            boolean isAuthorized = authorities.contains(requiredAuth) || 
                                   authorities.contains(canonicalSelected) ||
                                   authorities.stream().anyMatch(a -> a.equalsIgnoreCase(requiredAuth) || a.equalsIgnoreCase(canonicalSelected));

            if (isAuthorized) {
                String target = "/dashboard/" + RoleUtils.toPathSegment(canonicalSelected);
                logger.info("Authorization successful for user '{}'. Redirecting to: {}", username, target);
                response.sendRedirect(target);
                return;
            } else {
                logger.warn("Authorization failed for user '{}'. Selected role '{}' does not match authorities {}.", 
                            username, selectedRole, authorities);
                logoutHandler.logout(request, response, authentication);
                response.sendRedirect("/login?roleMismatch=1");
                return;
            }
        } else {
            logger.warn("No role selected for user '{}'. Checking for default access.", username);
            if (authorities.contains("ROLE_CITIZEN") || authorities.contains("CITIZEN")) {
                response.sendRedirect("/dashboard/user");
            } else {
                logger.error("No selected role and no default citizen role for user '{}'. Denying access.", username);
                logoutHandler.logout(request, response, authentication);
                response.sendRedirect("/login?error=roleMissing");
            }
        }
    }

    private static String consumeStoredLoginRole(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return null;
        Object raw = session.getAttribute(LoginSelectedRoleCaptureFilter.SESSION_KEY);
        session.removeAttribute(LoginSelectedRoleCaptureFilter.SESSION_KEY);
        return raw instanceof String s ? s : null;
    }
}
