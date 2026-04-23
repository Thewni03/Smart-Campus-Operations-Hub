package com.SmartCampus.SmartCampus.Service;

import com.SmartCampus.SmartCampus.Entity.Resource;
import com.SmartCampus.SmartCampus.Repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Override
    public Resource createResource(Resource resource) {
        resource.setCreatedAt(LocalDateTime.now());
        resource.setUpdatedAt(LocalDateTime.now());
        return resourceRepository.save(resource);
    }

    @Override
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    @Override
    public Resource getResourceById(String id) {
        return resourceRepository.findById(id).orElse(null);
    }

    @Override
    public Resource updateResource(String id, Resource resource) {
        Optional<Resource> existingOpt = resourceRepository.findById(id);
        if (existingOpt.isPresent()) {
            Resource existing = existingOpt.get();
            existing.setName(resource.getName());
            existing.setType(resource.getType());
            existing.setCapacity(resource.getCapacity());
            existing.setLocation(resource.getLocation());
            existing.setStatus(resource.getStatus());
            existing.setAvailability(resource.getAvailability());
            existing.setImages(resource.getImages());
            existing.setUpdatedAt(LocalDateTime.now());
            return resourceRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }
}
