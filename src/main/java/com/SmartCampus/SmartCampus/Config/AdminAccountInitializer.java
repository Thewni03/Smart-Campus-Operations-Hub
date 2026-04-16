package com.SmartCampus.SmartCampus.Config;

import com.SmartCampus.SmartCampus.Entity.UserAccount;
import com.SmartCampus.SmartCampus.Repository.UserAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AdminAccountInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminAccountInitializer.class);

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.seed.enabled:true}")
    private boolean adminSeedEnabled;

    @Value("${app.admin.email:admin@smartcampus.local}")
    private String adminEmail;

    @Value("${app.admin.password:Admin@123}")
    private String adminPassword;

    @Value("${app.admin.full-name:Smart Campus Admin}")
    private String adminFullName;

    public AdminAccountInitializer(
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!adminSeedEnabled) {
            return;
        }

        String normalizedEmail = adminEmail.trim().toLowerCase();
        if (userAccountRepository.existsByEmail(normalizedEmail)) {
            log.info("Admin seed skipped because an account already exists for {}", normalizedEmail);
            return;
        }

        UserAccount admin = new UserAccount();
        admin.setFullName(adminFullName.trim());
        admin.setEmail(normalizedEmail);
        admin.setRole("ADMIN");
        admin.setOauthProvider("LOCAL");
        admin.setOauthId(normalizedEmail);
        admin.setCreatedAt(LocalDateTime.now());
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));

        userAccountRepository.save(admin);
        log.info("Admin account created for {}", normalizedEmail);
    }
}
