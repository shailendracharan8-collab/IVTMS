package com.ivtms.security;

import com.ivtms.config.CustomAuthenticationSuccessHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomAuthenticationSuccessHandler successHandler;

    @Autowired
    private LoginSelectedRoleCaptureFilter loginSelectedRoleCaptureFilter;

    @Autowired
    private IvTmsAuthenticationDetailsSource ivTmsAuthenticationDetailsSource;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .addFilterBefore(loginSelectedRoleCaptureFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests((requests) -> requests
                .requestMatchers("/", "/home", "/register", "/login", "/services", "/about", "/contact").permitAll()
                /* Public informational service routes (marketing / info pages). */
                .requestMatchers("/vehicle-registration", "/insurance-tracking", "/puc-eco-status", "/road-tax").permitAll()
                .requestMatchers("/css/**", "/js/**", "/images/**", "/webjars/**").permitAll()
                .requestMatchers("/dashboard/admin", "/dashboard/admin/**").hasRole("ADMIN")
                .requestMatchers("/dashboard/rto", "/dashboard/rto/**").hasRole("RTO")
                .requestMatchers("/dashboard/inspector", "/dashboard/inspector/**").hasRole("INSPECTOR")
                .requestMatchers("/dashboard/user", "/dashboard/user/**").hasRole("CITIZEN")
                .anyRequest().authenticated()
            )
            .formLogin((form) -> form
                .loginPage("/login")
                .authenticationDetailsSource(ivTmsAuthenticationDetailsSource)
                .successHandler(successHandler)
                .permitAll()
            )
            .logout((logout) -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            );

        return http.build();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:5500",
                "http://127.0.0.1:5500",
                "http://localhost:8080"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
