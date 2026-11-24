
package com.gamehub.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gamehub.user.entity.Role;

public interface RoleRepository
        extends JpaRepository<Role, Integer> {

    // Tìm role theo mã CUSTOMER, ADMIN, STAFF
    Optional<Role> findByRoleCode(String roleCode);
}
