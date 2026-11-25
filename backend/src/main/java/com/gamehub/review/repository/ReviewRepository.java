package com.gamehub.review.repository;

import com.gamehub.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByProduct_ProductIdAndReviewStatus(Long productId, String status, Pageable pageable);

    boolean existsByOrderItemId(Long orderItemId);

    Optional<Review> findByReviewIdAndUser_UserId(Long reviewId, Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.productId = :productId AND r.reviewStatus = 'VISIBLE'")
    Double getAverageRatingForProduct(@Param("productId") Long productId);

    long countByProduct_ProductIdAndReviewStatus(Long productId, String status);
}
