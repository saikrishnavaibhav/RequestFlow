package com.requestflow.repositories;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import com.requestflow.entities.NotificationEntity;

public interface NotificationsRepository extends CrudRepository<NotificationEntity, Long> {
	
	List<NotificationEntity> findAllByUserId(Long userId);

}