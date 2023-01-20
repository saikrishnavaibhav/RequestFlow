package com.requestflow.repositories;

import org.springframework.data.repository.CrudRepository;

import com.requestflow.entities.RequestEntity;

public interface RequestRepository extends CrudRepository<RequestEntity, Long> {

}
