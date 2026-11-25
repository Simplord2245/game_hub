package com.gamehub.coupon.dto;

import java.math.BigDecimal;

public record CouponValidateResponse(
        Long couponId,
        String couponCode,
        String discountType,
        BigDecimal discountValue,
        BigDecimal maximumDiscount,
        BigDecimal minimumOrderValue,
        BigDecimal discountAmount,
        BigDecimal finalTotal
) {}
