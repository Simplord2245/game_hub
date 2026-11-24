package com.gamehub.order.dto;

import com.gamehub.order.entity.Order;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long orderId,
        String orderCode,
        String orderStatus,
        BigDecimal subtotal,
        BigDecimal discountTotal,
        BigDecimal totalAmount,
        String customerNote,
        LocalDateTime paymentDeadline,
        List<OrderItemResponse> items,
        LocalDateTime createdAt
) {
    public static OrderResponse from(Order order, List<OrderItemResponse> itemResponses) {
        return new OrderResponse(
                order.getOrderId(),
                order.getOrderCode(),
                order.getOrderStatus(),
                order.getSubtotal(),
                order.getDiscountTotal(),
                order.getTotalAmount(),
                order.getCustomerNote(),
                order.getPaymentDeadline(),
                itemResponses,
                order.getCreatedAt()
        );
    }
}
