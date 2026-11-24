package com.gamehub.coupon.entity;

import com.gamehub.user.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupon_redemptions")
public class CouponRedemption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "redemption_id")
    private Long redemptionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id", nullable = false)
    private Coupon coupon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "order_id", nullable = false, unique = true)
    private Long orderId;

    @Column(name = "discount_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal discountAmount;

    @Column(name = "redeemed_at", insertable = false, updatable = false)
    private LocalDateTime redeemedAt;

    public CouponRedemption() { }

    public CouponRedemption(Coupon coupon, User user, Long orderId, BigDecimal discountAmount) {
        this.coupon = coupon;
        this.user = user;
        this.orderId = orderId;
        this.discountAmount = discountAmount;
    }

    public Long getRedemptionId() { return redemptionId; }
    public Coupon getCoupon() { return coupon; }
    public User getUser() { return user; }
    public Long getOrderId() { return orderId; }
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public LocalDateTime getRedeemedAt() { return redeemedAt; }
}
