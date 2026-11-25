package com.gamehub.cart.repository;

import com.gamehub.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCart_CartIdAndProduct_ProductId(Long cartId, Long productId);
    Optional<CartItem> findByCartItemIdAndCart_CartId(Long cartItemId, Long cartId);
}
