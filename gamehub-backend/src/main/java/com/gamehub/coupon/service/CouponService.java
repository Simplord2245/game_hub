package com.gamehub.coupon.service;

import com.gamehub.common.exception.ResourceNotFoundException;
import com.gamehub.coupon.dto.CouponValidateRequest;
import com.gamehub.coupon.dto.CouponValidateResponse;
import com.gamehub.coupon.entity.Coupon;
import com.gamehub.coupon.entity.CouponRedemption;
import com.gamehub.coupon.repository.CouponRedemptionRepository;
import com.gamehub.coupon.repository.CouponRepository;
import com.gamehub.user.entity.User;
import com.gamehub.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
public class CouponService {

    private final CouponRepository couponRepository;
    private final CouponRedemptionRepository couponRedemptionRepository;
    private final UserRepository userRepository;

    public CouponService(CouponRepository couponRepository,
                         CouponRedemptionRepository couponRedemptionRepository,
                         UserRepository userRepository) {
        this.couponRepository = couponRepository;
        this.couponRedemptionRepository = couponRedemptionRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public CouponValidateResponse validateCoupon(String email, CouponValidateRequest request) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng."));

        Coupon coupon = couponRepository.findByCouponCodeIgnoreCase(request.couponCode())
                .orElseThrow(() -> new ResourceNotFoundException("Mã giảm giá không tồn tại."));

        if (!"ACTIVE".equalsIgnoreCase(coupon.getCouponStatus())) {
            throw new IllegalArgumentException("Mã giảm giá hiện không hoạt động.");
        }

        LocalDateTime now = LocalDateTime.now();
        if (coupon.getStartsAt() != null && now.isBefore(coupon.getStartsAt())) {
            throw new IllegalArgumentException("Mã giảm giá chưa đến đợt áp dụng.");
        }

        if (coupon.getExpiresAt() != null && now.isAfter(coupon.getExpiresAt())) {
            throw new IllegalArgumentException("Mã giảm giá đã hết hạn sử dụng.");
        }

        if (coupon.getMinimumOrderValue() != null && request.orderTotal().compareTo(coupon.getMinimumOrderValue()) < 0) {
            throw new IllegalArgumentException("Đơn hàng tối thiểu để áp dụng mã là " + coupon.getMinimumOrderValue() + " đ.");
        }

        if (coupon.getUsageLimit() != null) {
            long totalUsed = couponRedemptionRepository.countByCoupon_CouponId(coupon.getCouponId());
            if (totalUsed >= coupon.getUsageLimit()) {
                throw new IllegalArgumentException("Mã giảm giá đã hết lượt sử dụng.");
            }
        }

        long userUsed = couponRedemptionRepository.countByCoupon_CouponIdAndUser_UserId(coupon.getCouponId(), user.getUserId());
        if (userUsed >= coupon.getPerUserLimit()) {
            throw new IllegalArgumentException("Bạn đã đạt giới hạn sử dụng mã giảm giá này (" + coupon.getPerUserLimit() + " lần).");
        }

        BigDecimal discountAmount;
        if ("PERCENT".equalsIgnoreCase(coupon.getDiscountType())) {
            discountAmount = request.orderTotal()
                    .multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (coupon.getMaximumDiscount() != null && discountAmount.compareTo(coupon.getMaximumDiscount()) > 0) {
                discountAmount = coupon.getMaximumDiscount();
            }
        } else {
            discountAmount = coupon.getDiscountValue();
        }

        if (discountAmount.compareTo(request.orderTotal()) > 0) {
            discountAmount = request.orderTotal();
        }

        BigDecimal finalTotal = request.orderTotal().subtract(discountAmount);

        return new CouponValidateResponse(
                coupon.getCouponId(),
                coupon.getCouponCode(),
                coupon.getDiscountType(),
                coupon.getDiscountValue(),
                coupon.getMaximumDiscount(),
                coupon.getMinimumOrderValue(),
                discountAmount,
                finalTotal
        );
    }

    @Transactional
    public void recordRedemption(Coupon coupon, User user, Long orderId, BigDecimal discountAmount) {
        CouponRedemption redemption = new CouponRedemption(coupon, user, orderId, discountAmount);
        couponRedemptionRepository.save(redemption);
    }
}
