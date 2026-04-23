package com.SmartCampus.SmartCampus.Repository;

import com.SmartCampus.SmartCampus.Entity.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
}
