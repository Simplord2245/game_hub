package com.gamehub.cart.dto;

import com.gamehub.cart.entity.Cart;
import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        Long cartId,
        List<CartItemResponse> items,
        int totalItems,
        BigDecimal grandTotal
) {
    public static CartResponse from(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(CartItemResponse::from)
                .toList();

        int count = itemResponses.stream().mapToInt(CartItemResponse::quantity).sum();
        BigDecimal total = itemResponses.stream()
                .map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(cart.getCartId(), itemResponses, count, total);
    }
}
