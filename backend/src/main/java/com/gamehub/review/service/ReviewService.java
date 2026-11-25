package com.gamehub.review.service;

import com.gamehub.common.api.PageResponse;
import com.gamehub.common.exception.ResourceNotFoundException;
import com.gamehub.product.entity.Product;
import com.gamehub.product.repository.ProductRepository;
import com.gamehub.review.dto.ReviewRequest;
import com.gamehub.review.dto.ReviewResponse;
import com.gamehub.review.entity.Review;
import com.gamehub.review.repository.ReviewRepository;
import com.gamehub.user.entity.User;
import com.gamehub.user.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ReviewResponse createReview(String email, ReviewRequest request) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng."));

        if (reviewRepository.existsByOrderItemId(request.orderItemId())) {
            throw new IllegalArgumentException("Dòng đơn hàng này đã được đánh giá.");
        }

        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm."));

        Review review = new Review(product, user, request.orderItemId(), request.rating(), request.comment());
        Review saved = reviewRepository.save(review);
        return ReviewResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getProductReviews(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), Sort.by("createdAt").descending());
        var reviews = reviewRepository.findByProduct_ProductIdAndReviewStatus(productId, "VISIBLE", pageable);
        return PageResponse.from(reviews.map(ReviewResponse::from));
    }
}
