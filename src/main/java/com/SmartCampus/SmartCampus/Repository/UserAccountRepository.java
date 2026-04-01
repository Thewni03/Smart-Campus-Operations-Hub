package com.SmartCampus.SmartCampus.Repository;

import com.SmartCampus.SmartCampus.Entity.UserAccount;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAccountRepository extends MongoRepository<UserAccount, String> {

    // Used during login to locate a user by email.
    Optional<UserAccount> findByEmail(String email);

    // Used during signup to prevent duplicate accounts.
    boolean existsByEmail(String email);
}
