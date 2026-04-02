package com.SmartCampus.SmartCampus.Util;

import com.SmartCampus.SmartCampus.Exception.UnauthorizedActionException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Utility to extract the current authenticated user from the Security context.
 *
 * INTEGRATION NOTE FOR MEMBER 4:
 * Once JWT is wired in, the Authentication principal will carry userId and role.
 * Replace the stub below with actual principal extraction from your JwtUserDetails.
 *
 * Example with your JWT:
 *   JwtUserDetails user = (JwtUserDetails) getAuthentication().getPrincipal();
 *   return user.getId();
 */
@Component
public class SecurityUtil {

    /**
     * Returns the currently authenticated user's ID.
     * Throws UnauthorizedActionException if not authenticated.
     */
    public String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new UnauthorizedActionException("User is not authenticated");
        }

        // TODO: Replace with JwtUserDetails cast once Member 4's JWT is integrated
        // JwtUserDetails user = (JwtUserDetails) auth.getPrincipal();
        // return user.getId();

        // Stub: returns the username (email) as ID until JWT integration
        return auth.getName();
    }

    /**
     * Returns the role of the currently authenticated user.
     */
    public String getCurrentUserRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new UnauthorizedActionException("User is not authenticated");
        }

        return auth.getAuthorities().stream()
                .findFirst()
                .map(Object::toString)
                .orElse("ROLE_USER");
    }

    /**
     * Checks whether the current user has ADMIN role.
     */
    public boolean isAdmin() {
        return getCurrentUserRole().contains("ADMIN");
    }

    /**
     * Checks whether the current user has TECHNICIAN role.
     */
    public boolean isTechnician() {
        String role = getCurrentUserRole();
        return role.contains("TECHNICIAN") || role.contains("ADMIN");
    }

    /**
     * Asserts that the current user is the owner OR an admin.
     * Used to enforce comment edit/delete ownership rules.
     */
    public void assertOwnerOrAdmin(String ownerId) {
        String currentUserId = getCurrentUserId();
        if (!currentUserId.equals(ownerId) && !isAdmin()) {
            throw new UnauthorizedActionException(
                    "You are not allowed to perform this action on another user's resource"
            );
        }
    }
}