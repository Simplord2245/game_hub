package com.gamehub.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReviewRequest(
        @NotNull(message = "ID dòng đơn hàng không được để trống")
        Long orderItemId,

        @NotNull(message = "ID sản phẩm không được để trống")
        Long productId,

        @Min(value = 1, message = "Đánh giá tối thiểu 1 sao")
        @Max(value = 5, message = "Đánh giá tối đa 5 sao")
        int rating,

        @Size(max = 2000, message = "Nội dung đánh giá tối đa 2000 ký tự")
        String comment
) {}
