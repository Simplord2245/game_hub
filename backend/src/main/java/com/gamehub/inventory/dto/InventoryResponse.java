package com.gamehub.inventory.dto;

import com.gamehub.inventory.entity.ProductInventory;
import java.time.LocalDateTime;

public record InventoryResponse(
        Long inventoryId,
        Long productId,
        String productName,
        String inventoryCode,
        String displayNote,
        String inventoryStatus,
        LocalDateTime createdAt
) {
    public static InventoryResponse from(ProductInventory pi) {
        return new InventoryResponse(
                pi.getInventoryId(),
                pi.getProduct().getProductId(),
                pi.getProduct().getProductName(),
                pi.getInventoryCode(),
                pi.getDisplayNote(),
                pi.getInventoryStatus(),
                pi.getCreatedAt()
        );
    }
}
