package com.SmartCampus.SmartCampus.Dto.Response;

import java.time.LocalDateTime;

public record UserSummaryResponse(
        String id,
        String fullName,
        String email,
        String role,
        String oauthProvider,
        LocalDateTime createdAt
) {
}
