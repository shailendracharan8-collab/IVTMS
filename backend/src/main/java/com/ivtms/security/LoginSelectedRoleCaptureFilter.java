package com.ivtms.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Spring Security's form-login flow often does not expose custom fields (e.g. {@code role})
 * on the {@link HttpServletRequest} inside {@code AuthenticationSuccessHandler}.
 * We persist the user's "Login As" choice in the session on {@code POST /login} so redirects stay correct.
 */
@Component
public class LoginSelectedRoleCaptureFilter extends OncePerRequestFilter {

    public static final String SESSION_KEY = "IVTMS_LOGIN_SELECTED_ROLE";

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(LoginSelectedRoleCaptureFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if ("POST".equalsIgnoreCase(request.getMethod()) && isFormLoginRequest(request)) {
            String role = request.getParameter("role");
            logger.info("Login capture filter triggered. Found role parameter: {}", role);
            if (role != null && !role.isBlank()) {
                HttpSession session = request.getSession(true);
                session.setAttribute(SESSION_KEY, role.trim());
                logger.info("Stored role '{}' in session key '{}'", role.trim(), SESSION_KEY);
            } else {
                logger.warn("Login capture filter: 'role' parameter is missing or blank in POST /login");
            }
        }
        filterChain.doFilter(request, response);
    }

    /** Match /login with or without servletPath quirks and optional context path */
    private static boolean isFormLoginRequest(HttpServletRequest request) {
        String sp = trimTrailingSlash(request.getServletPath());
        if ("/login".equals(sp)) {
            return true;
        }
        String uri = request.getRequestURI();
        if (uri == null) {
            return false;
        }
        String ctx = request.getContextPath();
        if (ctx == null || ctx.isEmpty()) {
            return uri.equals("/login") || uri.endsWith("/login");
        }
        return uri.equals(ctx + "/login") || uri.equals(ctx + "/login/");
    }

    private static String trimTrailingSlash(String path) {
        if (path == null || path.length() <= 1) {
            return path;
        }
        return path.endsWith("/") ? path.substring(0, path.length() - 1) : path;
    }
}
