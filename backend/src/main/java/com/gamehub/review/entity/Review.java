package com.gamehub.review.entity;

import com.gamehub.product.entity.Product;
import com.gamehub.user.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "order_item_id", nullable = false, unique = true)
    private Long orderItemId;

    @Column(nullable = false)
    private int rating; // 1 to 5

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "review_status", nullable = false)
    private String reviewStatus = "VISIBLE"; // 'VISIBLE','HIDDEN'

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public Review() { }

    public Review(Product product, User user, Long orderItemId, int rating, String comment) {
        this.product = product;
        this.user = user;
        this.orderItemId = orderItemId;
        this.rating = rating;
        this.comment = comment;
        this.reviewStatus = "VISIBLE";
    }

    public Long getReviewId() { return reviewId; }
    public Product getProduct() { return product; }
    public User getUser() { return user; }
    public Long getOrderItemId() { return orderItemId; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public String getReviewStatus() { return reviewStatus; }
    public void setReviewStatus(String reviewStatus) { this.reviewStatus = reviewStatus; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
