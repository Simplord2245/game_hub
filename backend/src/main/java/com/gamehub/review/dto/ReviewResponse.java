package com.gamehub.review.dto;

import com.gamehub.review.entity.Review;
import java.time.LocalDateTime;

public record ReviewResponse(
        Long reviewId,
        Long productId,
        String productName,
        Long userId,
        String userName,
        String userAvatar,
        int rating,
        String comment,
        LocalDateTime createdAt
) {
    public static ReviewResponse from(Review review) {
        return new ReviewResponse(
                review.getReviewId(),
                review.getProduct().getProductId(),
                review.getProduct().getProductName(),
                review.getUser().getUserId(),
                review.getUser().getFullName(),
                review.getUser().getAvatarUrl(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}
