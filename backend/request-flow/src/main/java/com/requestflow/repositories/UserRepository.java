package com.requestflow.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.requestflow.entities.UserEntity;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, Long>{

}
