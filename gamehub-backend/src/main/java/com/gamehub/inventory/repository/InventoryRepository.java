package com.gamehub.inventory.repository;

import com.gamehub.inventory.entity.ProductInventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InventoryRepository extends JpaRepository<ProductInventory, Long> {
    long countByProduct_ProductIdAndInventoryStatus(Long productId, String status);

    List<ProductInventory> findByProduct_ProductIdAndInventoryStatusOrderByCreatedAtAsc(
            Long productId, String status, Pageable pageable);

    List<ProductInventory> findByOrderItemId(Long orderItemId);

    Page<ProductInventory> findByProduct_ProductId(Long productId, Pageable pageable);

    @Query("SELECT COUNT(pi) FROM ProductInventory pi WHERE pi.product.productId = :productId AND pi.inventoryStatus = 'AVAILABLE'")
    long countAvailableStock(@Param("productId") Long productId);

    @Query("SELECT COUNT(pi) FROM ProductInventory pi WHERE pi.product.productId = :productId AND pi.inventoryStatus = 'RESERVED'")
    long countReservedStock(@Param("productId") Long productId);

    @Query("SELECT COUNT(pi) FROM ProductInventory pi WHERE pi.product.productId = :productId AND pi.inventoryStatus = 'SOLD'")
    long countSoldStock(@Param("productId") Long productId);
}
