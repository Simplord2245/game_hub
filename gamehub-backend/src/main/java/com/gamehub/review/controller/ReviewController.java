package com.gamehub.review.controller;

import com.gamehub.common.api.ApiResponse;
import com.gamehub.common.api.PageResponse;
import com.gamehub.review.dto.ReviewRequest;
import com.gamehub.review.dto.ReviewResponse;
import com.gamehub.review.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/products/{productId}/reviews")
    public ApiResponse<PageResponse<ReviewResponse>> getProductReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success("Lấy danh sách đánh giá thành công.",
                reviewService.getProductReviews(productId, page, size));
    }

    @PostMapping("/reviews")
    public ApiResponse<ReviewResponse> createReview(
            Authentication authentication,
            @Valid @RequestBody ReviewRequest request) {
        return ApiResponse.success("Đánh giá sản phẩm thành công.",
                reviewService.createReview(authentication.getName(), request));
    }
}
