package com.gamehub.category.dto;

import com.gamehub.category.entity.ProductCategory;

public record CategoryResponse(Long id, String name, String slug, String description) {
    public static CategoryResponse from(ProductCategory category) {
        return new CategoryResponse(category.getCategoryId(), category.getCategoryName(),
                category.getSlug(), category.getDescription());
    }
}
