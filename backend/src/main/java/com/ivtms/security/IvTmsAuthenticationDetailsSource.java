package com.ivtms.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.AuthenticationDetailsSource;
import org.springframework.stereotype.Component;

@Component
public class IvTmsAuthenticationDetailsSource
        implements AuthenticationDetailsSource<HttpServletRequest, IvTmsWebAuthenticationDetails> {

    @Override
    public IvTmsWebAuthenticationDetails buildDetails(HttpServletRequest context) {
        return new IvTmsWebAuthenticationDetails(context);
    }
}
