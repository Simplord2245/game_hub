package com.gamehub.coupon.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record CouponValidateRequest(
        @NotBlank(message = "Mã giảm giá không được để trống")
        String couponCode,

        @NotNull(message = "Tổng tiền đơn hàng không được để trống")
        @DecimalMin(value = "0.0", inclusive = false, message = "Tổng tiền đơn hàng phải lớn hơn 0")
        BigDecimal orderTotal
) {}
