package com.gamehub.coupon.repository;

import com.gamehub.coupon.entity.CouponRedemption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRedemptionRepository extends JpaRepository<CouponRedemption, Long> {
    long countByCoupon_CouponId(Long couponId);
    long countByCoupon_CouponIdAndUser_UserId(Long couponId, Long userId);
}
