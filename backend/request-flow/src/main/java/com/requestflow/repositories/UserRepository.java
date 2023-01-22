package com.requestflow.repositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.requestflow.entities.UserEntity;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, Long>{

	Optional<UserEntity> findByUserName(String username);
	
	Boolean existsByUserName(String userName);

}
