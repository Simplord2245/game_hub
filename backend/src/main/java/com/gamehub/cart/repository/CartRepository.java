package com.gamehub.cart.repository;

import com.gamehub.cart.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser_UserId(Long userId);
    Optional<Cart> findByUser_EmailIgnoreCase(String email);
}
