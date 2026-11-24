
package com.gamehub.user.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gamehub.user.entity.User;
import com.gamehub.user.entity.UserStatus;

public interface UserRepository
        extends JpaRepository<User, Long> {

    // Tìm người dùng bằng email
    Optional<User> findByEmailIgnoreCase(String email);

    // Kiểm tra email đã được sử dụng chưa
    boolean existsByEmailIgnoreCase(String email);
    
    // check sđt
    boolean existsByPhone(String phone);

    // check sđt trùng với user khác
    boolean existsByPhoneAndUserIdNot(String phone, Long userId);

    @Query("SELECT u FROM User u WHERE " +
           "(:keyword IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:status IS NULL OR u.userStatus = :status)")
    Page<User> searchUsers(@Param("keyword") String keyword, @Param("status") UserStatus status, Pageable pageable);
}
