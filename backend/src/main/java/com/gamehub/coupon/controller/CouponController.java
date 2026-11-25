package com.gamehub.coupon.controller;

import com.gamehub.common.api.ApiResponse;
import com.gamehub.coupon.dto.CouponValidateRequest;
import com.gamehub.coupon.dto.CouponValidateResponse;
import com.gamehub.coupon.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping("/validate")
    public ApiResponse<CouponValidateResponse> validateCoupon(
            Authentication authentication,
            @Valid @RequestBody CouponValidateRequest request) {
        return ApiResponse.success("Kiểm tra mã giảm giá thành công.",
                couponService.validateCoupon(authentication.getName(), request));
    }
}
