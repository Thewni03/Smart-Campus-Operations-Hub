package com.SmartCampus.SmartCampus.Security;

public record CurrentUserPrincipal(
        String id,
        String name,
        String email,
        String role
) {
}
