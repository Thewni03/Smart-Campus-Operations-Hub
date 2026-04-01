package com.SmartCampus.SmartCampus.Service;

import com.SmartCampus.SmartCampus.Dto.Request.LoginRequest;
import com.SmartCampus.SmartCampus.Dto.Request.SignupRequest;
import com.SmartCampus.SmartCampus.Dto.Response.AuthResponse;
import com.SmartCampus.SmartCampus.Entity.UserAccount;
import com.SmartCampus.SmartCampus.Exception.AuthException;
import com.SmartCampus.SmartCampus.Repository.UserAccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponse signup(SignupRequest request) {
        // Normalize email once so signup and login use the same lookup format.
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userAccountRepository.existsByEmail(normalizedEmail)) {
            throw new AuthException("An account with this email already exists");
        }

        // Store a hashed password rather than the raw password.
        UserAccount user = new UserAccount();
        user.setFullName(request.getFullName().trim());
        user.setEmail(normalizedEmail);
        user.setRole(request.getRole().trim());
        user.setOauthProvider(request.getOauthProvider().trim());
        user.setOauthId(request.getOauthId().trim());
        user.setCreatedAt(LocalDateTime.now());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        UserAccount savedUser = userAccountRepository.save(user);

        return new AuthResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                "Account created successfully"
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Login also uses normalized email to match the saved record.
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        UserAccount user = userAccountRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new AuthException("Invalid email or password"));

        // Compare the raw input with the stored hash.
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AuthException("Invalid email or password");
        }

        return new AuthResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                "Login successful"
        );
    }
}
