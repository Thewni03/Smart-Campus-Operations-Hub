package com.SmartCampus.SmartCampus.Service;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.SmartCampus.SmartCampus.Dto.Request.GoogleLoginRequest;
import com.SmartCampus.SmartCampus.Dto.Request.LoginRequest;
import com.SmartCampus.SmartCampus.Dto.Request.SignupRequest;
import com.SmartCampus.SmartCampus.Dto.Response.AuthResponse;
import com.SmartCampus.SmartCampus.Entity.UserAccount;
import com.SmartCampus.SmartCampus.Exception.AuthException;
import com.SmartCampus.SmartCampus.Repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestClient restClient;
    private final String googleClientId;

    public AuthServiceImpl(
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.google.client-id}") String googleClientId
    ) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.restClient = RestClient.builder()
                .baseUrl("https://oauth2.googleapis.com")
                .build();
        this.googleClientId = googleClientId;
    }

    @Override
    public AuthResponse signup(SignupRequest request) {
        // Normalize email once so signup and login use the same lookup format.
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        String requestedRole = request.getRole().trim().toUpperCase();

        if (userAccountRepository.existsByEmail(normalizedEmail)) {
            throw new AuthException("An account with this email already exists");
        }

        if ("ADMIN".equals(requestedRole)) {
            throw new AuthException("Admin accounts cannot be created from signup");
        }

        // Store a hashed password rather than the raw password.
        UserAccount user = new UserAccount();
        user.setFullName(request.getFullName().trim());
        user.setEmail(normalizedEmail);
        user.setRole(requestedRole);
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
        String passwordHash = user.getPasswordHash();
        if (passwordHash == null || passwordHash.isBlank() || !passwordEncoder.matches(request.getPassword(), passwordHash)) {
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

    @Override
    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
        if (googleClientId == null || googleClientId.isBlank()) {
            throw new AuthException("Google sign-in is not configured for this application");
        }

        GoogleTokenInfo tokenInfo = fetchGoogleTokenInfo(request.getIdToken().trim());
        String audience = readRequired(tokenInfo.aud(), "aud");
        String email = readRequired(tokenInfo.email(), "email").toLowerCase();
        String fullName = readRequired(tokenInfo.name(), "name");
        String googleSubject = readRequired(tokenInfo.sub(), "sub");
        String emailVerified = readRequired(tokenInfo.emailVerified(), "email_verified");

        if (!googleClientId.equals(audience)) {
            throw new AuthException("This Google account is not allowed for this application");
        }

        if (!"true".equalsIgnoreCase(emailVerified)) {
            throw new AuthException("Please use a Google account with a verified email address");
        }

        UserAccount user = userAccountRepository.findByEmail(email)
                .orElseGet(() -> createGoogleStudent(email, fullName, googleSubject));

        if ("ADMIN".equalsIgnoreCase(user.getRole()) && !"GOOGLE".equalsIgnoreCase(user.getOauthProvider())) {
            throw new AuthException("Admin accounts must use email and password sign-in");
        }

        return new AuthResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                "Login successful"
        );
    }

    private GoogleTokenInfo fetchGoogleTokenInfo(String idToken) {
        try {
            GoogleTokenInfo tokenInfo = restClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/tokeninfo")
                            .queryParam("id_token", idToken)
                            .build())
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, (request, response) -> {
                        throw new AuthException("Google sign-in could not be verified");
                    })
                    .body(GoogleTokenInfo.class);

            if (tokenInfo == null) {
                throw new AuthException("Google sign-in could not be verified");
            }

            return tokenInfo;
        } catch (RestClientResponseException ex) {
            throw new AuthException("Google sign-in could not be verified");
        } catch (RestClientException ex) {
            throw new AuthException("Google sign-in is unavailable right now. Please try again.");
        }
    }

    private UserAccount createGoogleStudent(String email, String fullName, String googleSubject) {
        UserAccount user = new UserAccount();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setRole("STUDENT");
        user.setOauthProvider("GOOGLE");
        user.setOauthId(googleSubject);
        user.setCreatedAt(LocalDateTime.now());
        user.setPasswordHash(null);
        return userAccountRepository.save(user);
    }

    private String readRequired(String value, String key) {
        if (value == null || value.isBlank()) {
            throw new AuthException("Google sign-in response is missing " + key);
        }
        return value.trim();
    }

    private record GoogleTokenInfo(
            String aud,
            String email,
            String name,
            String sub,
            @JsonProperty("email_verified")
            String emailVerified
    ) {
    }
}
