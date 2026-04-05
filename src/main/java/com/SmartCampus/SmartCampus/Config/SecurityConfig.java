package com.SmartCampus.SmartCampus.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity   // enables @PreAuthorize on controller methods
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // Public — anyone can view tickets (read-only)
                        .requestMatchers(HttpMethod.GET, "/api/tickets/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/comments/**").permitAll()

                        // Uploads served as static files
                        .requestMatchers("/uploads/**").permitAll()

                        // Everything else requires authentication
                        // TODO: replace permitAll() with .authenticated() once Member 4 JWT is wired in
                        .anyRequest().permitAll()
                );

        return http.build();
    }

     @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
