package com.SmartCampus.SmartCampus.Dto.Request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateResolutionRequest {

    @NotBlank(message = "Resolution notes are required")
    private String resolutionNotes;
}
