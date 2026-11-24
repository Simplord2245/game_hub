package com.gamehub.order.dto;

import com.gamehub.order.entity.OrderItem;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderItemResponse(
        Long orderItemId,
        Long productId,
        String sku,
        String productName,
        BigDecimal unitPrice,
        int quantity,
        BigDecimal lineTotal,
        String deliveryStatus,
        LocalDateTime deliveredAt,
        List<String> deliveredItems // Danh sách secret/key nếu đã giao
) {
    public static OrderItemResponse from(OrderItem item, List<String> secrets) {
        return new OrderItemResponse(
                item.getOrderItemId(),
                item.getProduct() != null ? item.getProduct().getProductId() : null,
                item.getSkuSnapshot(),
                item.getNameSnapshot(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getLineTotal(),
                item.getDeliveryStatus(),
                item.getDeliveredAt(),
                secrets
        );
    }
}
