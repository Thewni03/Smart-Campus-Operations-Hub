package com.SmartCampus.SmartCampus.Dto.Response;

public record AuthResponse(
        String userId,
        String fullName,
        String email,
        String role,
        String message
) {}
