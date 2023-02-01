package com.requestflow.repositories;

import org.springframework.data.repository.CrudRepository;

import com.requestflow.entities.LogEntity;

public interface LogsRepository extends CrudRepository<LogEntity, Long> {

}
