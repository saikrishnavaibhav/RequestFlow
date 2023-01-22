package com.requestflow.repositories;

import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.requestflow.entities.Role;
import com.requestflow.utils.Roles;

@Repository
public interface RoleRepository extends CrudRepository<Role, Long> {

	Optional<Role> findByRole(Roles role);
}
