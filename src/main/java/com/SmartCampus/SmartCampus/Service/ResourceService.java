package com.SmartCampus.SmartCampus.Service;

import com.SmartCampus.SmartCampus.Entity.Resource;
import java.util.List;

public interface ResourceService {
    Resource createResource(Resource resource);
    List<Resource> getAllResources();
    Resource getResourceById(String id);
    Resource updateResource(String id, Resource resource);
    void deleteResource(String id);
}
