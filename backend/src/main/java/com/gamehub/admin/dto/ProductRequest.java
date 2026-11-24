package com.gamehub.admin.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ProductRequest(
        @NotNull(message = "Game ID không được để trống")
        Long gameId,

        @NotNull(message = "Category ID không được để trống")
        Long categoryId,

        @NotBlank(message = "Mã SKU không được để trống")
        @Size(max = 50, message = "SKU tối đa 50 ký tự")
        String sku,

        @NotBlank(message = "Tên sản phẩm không được để trống")
        @Size(max = 200, message = "Tên sản phẩm tối đa 200 ký tự")
        String productName,

        @NotBlank(message = "Slug sản phẩm không được để trống")
        @Size(max = 220, message = "Slug tối đa 220 ký tự")
        String slug,

        @NotBlank(message = "Loại sản phẩm không được để trống (ACCOUNT, GAME_KEY, ITEM_CODE)")
        String productType,

        @Size(max = 80, message = "Nền tảng tối đa 80 ký tự")
        String platform,

        @Size(max = 80, message = "Khu vực tối đa 80 ký tự")
        String region,

        @Size(max = 100, message = "Tên server tối đa 100 ký tự")
        String serverName,

        String description,

        @NotNull(message = "Giá không được để trống")
        @DecimalMin(value = "0.0", inclusive = false, message = "Giá sản phẩm phải lớn hơn 0")
        BigDecimal price,

        @DecimalMin(value = "0.0", inclusive = false, message = "Giá khuyến mãi phải lớn hơn 0")
        BigDecimal salePrice,

        String productStatus // 'DRAFT', 'ACTIVE', 'HIDDEN'
) {}
