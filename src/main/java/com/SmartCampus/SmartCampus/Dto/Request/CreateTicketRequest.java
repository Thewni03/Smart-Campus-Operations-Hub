package com.SmartCampus.SmartCampus.Dto.Request;

import com.SmartCampus.SmartCampus.Entity.enums.Category;
import com.SmartCampus.SmartCampus.Entity.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateTicketRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;

    @NotNull(message = "Category is required")
    private Category category;

    @NotNull(message = "Priority is required")
    private Priority priority;

    private String resourceId;      // nullable — optional resource link
    private String location;        // freetext location description
    private String contactDetails;  // nullable phone or email
}
