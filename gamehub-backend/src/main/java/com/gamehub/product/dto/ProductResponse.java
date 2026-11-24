package com.gamehub.product.dto;

import com.gamehub.product.entity.Product;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
        Long id,
        String sku,
        String name,
        String slug,
        String type,
        String platform,
        String region,
        String serverName,
        String description,
        BigDecimal price,
        BigDecimal salePrice,
        String status,
        GameSummary game,
        CategorySummary category,
        LocalDateTime createdAt
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getProductId(), product.getSku(), product.getProductName(),
                product.getSlug(), product.getProductType(), product.getPlatform(),
                product.getRegion(), product.getServerName(), product.getDescription(),
                product.getPrice(), product.getSalePrice(), product.getProductStatus(),
                new GameSummary(product.getGame().getGameId(), product.getGame().getGameName(),
                        product.getGame().getSlug(), product.getGame().getCoverUrl()),
                new CategorySummary(product.getCategory().getCategoryId(),
                        product.getCategory().getCategoryName(), product.getCategory().getSlug()),
                product.getCreatedAt()
        );
    }

    public record GameSummary(Long id, String name, String slug, String coverUrl) { }
    public record CategorySummary(Long id, String name, String slug) { }
}
