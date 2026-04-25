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
        UserAccount admin = userAccountRepository.findByEmail(normalizedEmail).orElseGet(UserAccount::new);

        boolean isNewAccount = admin.getId() == null;

        admin.setFullName(adminFullName.trim());
        admin.setEmail(normalizedEmail);
        admin.setRole("ADMIN");
        admin.setOauthProvider("LOCAL");
        admin.setOauthId(normalizedEmail);
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));

        if (isNewAccount || admin.getCreatedAt() == null) {
            admin.setCreatedAt(LocalDateTime.now());
        }

        userAccountRepository.save(admin);

        if (isNewAccount) {
            log.info("Admin account created for {}", normalizedEmail);
        } else {
            log.info("Admin account refreshed for {}", normalizedEmail);
        }
    }
}
