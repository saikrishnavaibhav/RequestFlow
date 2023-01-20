package com.requestflow.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.requestflow.entities.RequestEntity;

@Repository
public interface RequestRepository extends CrudRepository<RequestEntity, Long> {
	
	List<RequestEntity> findAllByUserId(Long userId); 

}
