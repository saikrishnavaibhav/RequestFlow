package com.requestflow.repositories;

import org.springframework.data.repository.CrudRepository;

import com.requestflow.entities.UserEntity;

public interface UserRepository extends CrudRepository<UserEntity, Long>{

}
