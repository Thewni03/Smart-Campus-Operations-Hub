package com.SmartCampus.SmartCampus.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {
    @Id
    private String id;
    private String name;
    private String type;
    private Integer capacity;
    private String location;
    private String status;
    private String availability;
    
    @Builder.Default
    private List<String> images = new java.util.ArrayList<>();
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Fallback for backwards compatibility with Postman tests that send "image" instead of "images"
    public void setImage(String image) {
        if (this.images == null) {
            this.images = new java.util.ArrayList<>();
        }
        if (image != null && !image.isEmpty()) {
            this.images.add(image);
        }
    }
}
