package com.SmartCampus.SmartCampus.Controller;

import com.SmartCampus.SmartCampus.Entity.Resource;
import com.SmartCampus.SmartCampus.Service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.SmartCampus.SmartCampus.Dto.Response.ApiResponse;
import com.SmartCampus.SmartCampus.Util.FileStorageUtil;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private FileStorageUtil fileStorageUtil;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadResourceImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = fileStorageUtil.storeFile(file);
            return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", fileUrl));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to store file"));
        }
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
        Resource created = resourceService.createResource(resource);
        return ResponseEntity.ok(created);
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_FORM_URLENCODED_VALUE })
    public ResponseEntity<Resource> createResourceForm(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "capacity", required = false) Integer capacity,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "availability", required = false) String availability,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "file", required = false) MultipartFile file) {
            
        Resource resource = new Resource();
        resource.setName(name);
        resource.setType(type);
        resource.setCapacity(capacity);
        resource.setLocation(location);
        resource.setStatus(status);
        resource.setAvailability(availability);
        
        MultipartFile actualFile = imageFile != null ? imageFile : file;
        if (actualFile != null && !actualFile.isEmpty()) {
            String fileUrl = fileStorageUtil.storeFile(actualFile);
            resource.setImage(fileUrl);
        }
        
        Resource created = resourceService.createResource(resource);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable String id) {
        Resource resource = resourceService.getResourceById(id);
        return resource != null ? ResponseEntity.ok(resource) : ResponseEntity.notFound().build();
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Resource> updateResource(@PathVariable String id, @RequestBody Resource resource) {
        Resource updated = resourceService.updateResource(id, resource);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_FORM_URLENCODED_VALUE })
    public ResponseEntity<Resource> updateResourceForm(
            @PathVariable String id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "capacity", required = false) Integer capacity,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "availability", required = false) String availability,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "file", required = false) MultipartFile file) {
            
        Resource resource = new Resource();
        resource.setName(name);
        resource.setType(type);
        resource.setCapacity(capacity);
        resource.setLocation(location);
        resource.setStatus(status);
        resource.setAvailability(availability);
        
        MultipartFile actualFile = imageFile != null ? imageFile : file;
        if (actualFile != null && !actualFile.isEmpty()) {
            String fileUrl = fileStorageUtil.storeFile(actualFile);
            resource.setImage(fileUrl);
        }
        
        Resource updated = resourceService.updateResource(id, resource);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
