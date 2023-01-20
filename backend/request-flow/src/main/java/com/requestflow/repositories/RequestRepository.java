package com.requestflow.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.requestflow.entities.RequestEntity;

public interface RequestRepository extends CrudRepository<RequestEntity, Long> {
	
	List<RequestEntity> findAllByUserId(Long userId); 

}
