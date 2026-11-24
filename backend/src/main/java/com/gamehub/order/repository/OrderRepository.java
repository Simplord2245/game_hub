package com.gamehub.order.repository;

import com.gamehub.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUser_UserId(Long userId, Pageable pageable);

    Optional<Order> findByOrderCodeAndUser_UserId(String orderCode, Long userId);

    Optional<Order> findByOrderIdAndUser_UserId(Long orderId, Long userId);

    @Query("SELECT o FROM Order o WHERE (:status IS NULL OR o.orderStatus = :status)")
    Page<Order> findAllByStatus(@Param("status") String status, Pageable pageable);
}
