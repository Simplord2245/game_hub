package com.gamehub.cart.dto;

import com.gamehub.cart.entity.CartItem;
import com.gamehub.product.entity.Product;
import java.math.BigDecimal;

public record CartItemResponse(
        Long cartItemId,
        Long productId,
        String sku,
        String productName,
        String productSlug,
        String coverUrl,
        BigDecimal price,
        BigDecimal salePrice,
        BigDecimal effectivePrice,
        int quantity,
        BigDecimal lineTotal
) {
    public static CartItemResponse from(CartItem item) {
        Product p = item.getProduct();
        BigDecimal eff = (p.getSalePrice() != null && p.getSalePrice().compareTo(BigDecimal.ZERO) > 0)
                ? p.getSalePrice()
                : p.getPrice();
        BigDecimal total = eff.multiply(BigDecimal.valueOf(item.getQuantity()));
        String cover = p.getGame() != null ? p.getGame().getCoverUrl() : null;

        return new CartItemResponse(
                item.getCartItemId(),
                p.getProductId(),
                p.getSku(),
                p.getProductName(),
                p.getSlug(),
                cover,
                p.getPrice(),
                p.getSalePrice(),
                eff,
                item.getQuantity(),
                total
        );
    }
}
