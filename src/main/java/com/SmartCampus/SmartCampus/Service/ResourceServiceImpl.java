package com.SmartCampus.SmartCampus.Service;

import com.SmartCampus.SmartCampus.Entity.Resource;
import com.SmartCampus.SmartCampus.Repository.ResourceRepository;
import com.SmartCampus.SmartCampus.Entity.UserAccount;
import com.SmartCampus.SmartCampus.Entity.enums.NotificationType;
import com.SmartCampus.SmartCampus.Repository.UserAccountRepository;
import com.SmartCampus.SmartCampus.Util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;
    private final UserAccountRepository userAccountRepository;
    private final NotificationService notificationService;
    private final SecurityUtil securityUtil;

    @Override
    public Resource createResource(Resource resource) {
        resource.setCreatedAt(LocalDateTime.now());
        resource.setUpdatedAt(LocalDateTime.now());
        Resource savedResource = resourceRepository.save(resource);
        notifyAllUsers(
                "New resource available: " + savedResource.getName(),
                NotificationType.RESOURCE_CREATED,
                savedResource.getId()
        );
        return savedResource;
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
            Resource savedResource = resourceRepository.save(existing);
            notifyAllUsers(
                    "Resource updated: " + savedResource.getName(),
                    NotificationType.RESOURCE_UPDATED,
                    savedResource.getId()
            );
            return savedResource;
        }
        return null;
    }

    @Override
    public void deleteResource(String id) {
        Resource existing = resourceRepository.findById(id).orElse(null);
        resourceRepository.deleteById(id);
        if (existing != null) {
            notifyAllUsers(
                    "Resource removed: " + existing.getName(),
                    NotificationType.RESOURCE_DELETED,
                    existing.getId()
            );
        }
    }

    private void notifyAllUsers(String message, NotificationType type, String resourceId) {
        String currentUserId = null;
        try {
            currentUserId = securityUtil.getCurrentUserId();
        } catch (RuntimeException ignored) {
        }

        for (UserAccount user : userAccountRepository.findAll()) {
            if (user.getId() == null || user.getId().isBlank()) {
                continue;
            }

            if (currentUserId != null && currentUserId.equals(user.getId())) {
                continue;
            }

            notificationService.createNotification(user.getId(), message, type, null, resourceId);
        }
    }
}
