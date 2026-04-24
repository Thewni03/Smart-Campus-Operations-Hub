package com.SmartCampus.SmartCampus.Util;

import com.SmartCampus.SmartCampus.Security.CurrentUserPrincipal;
import com.SmartCampus.SmartCampus.Exception.UnauthorizedActionException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
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

    public CurrentUserPrincipal getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            throw new UnauthorizedActionException("User is not authenticated");
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof CurrentUserPrincipal currentUserPrincipal) {
            return currentUserPrincipal;
        }

        throw new UnauthorizedActionException("User context is missing required identity information");
    }

    /**
     * Returns the currently authenticated user's ID.
     * Throws UnauthorizedActionException if not authenticated.
     */
    public String getCurrentUserId() {
        return getCurrentUser().id();
    }

    /**
     * Returns the role of the currently authenticated user.
     */
    public String getCurrentUserRole() {
        return "ROLE_" + getCurrentUser().role();
    }

    public String getCurrentUserName() {
        return getCurrentUser().name();
    }

    public String getCurrentUserEmail() {
        return getCurrentUser().email();
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

    public boolean isTechnicianOnly() {
        return getCurrentUserRole().contains("TECHNICIAN") && !isAdmin();
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
