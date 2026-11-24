package com.gamehub.favorite.dto;

import com.gamehub.favorite.entity.Favorite;
import com.gamehub.product.entity.Product;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FavoriteResponse(
        Long productId,
        String sku,
        String productName,
        String slug,
        String gameName,
        String coverUrl,
        BigDecimal price,
        BigDecimal salePrice,
        LocalDateTime createdAt
) {
    public static FavoriteResponse from(Favorite favorite) {
        Product p = favorite.getProduct();
        String gameName = p.getGame() != null ? p.getGame().getGameName() : null;
        String cover = p.getGame() != null ? p.getGame().getCoverUrl() : null;

        return new FavoriteResponse(
                p.getProductId(),
                p.getSku(),
                p.getProductName(),
                p.getSlug(),
                gameName,
                cover,
                p.getPrice(),
                p.getSalePrice(),
                favorite.getCreatedAt()
        );
    }
}
