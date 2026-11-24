package com.gamehub.product.service;

import com.gamehub.common.api.PageResponse;
import com.gamehub.common.exception.ResourceNotFoundException;
import com.gamehub.product.dto.ProductResponse;
import com.gamehub.product.repository.ProductRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> getActiveProducts(
            Long gameId, Long categoryId, String keyword,
            int page, int size, String sortBy) {

        Sort sort = switch (sortBy == null ? "latest" : sortBy.toLowerCase()) {
            case "price-asc" -> Sort.by("price").ascending();
            case "price-desc" -> Sort.by("price").descending();
            case "name" -> Sort.by("productName").ascending();
            default -> Sort.by("createdAt").descending();
        };

        Pageable pageable = PageRequest.of(Math.max(page, 0),
                Math.min(Math.max(size, 1), 50), sort);
        String normalizedKeyword = (keyword == null || keyword.isBlank()) ? null : keyword.trim();

        var result = productRepository.searchActiveProducts(
                gameId, categoryId, normalizedKeyword, pageable);
        return PageResponse.from(result.map(ProductResponse::from));
    }

    @Transactional(readOnly = true)
    public ProductResponse getActiveProductById(Long id) {
        return productRepository.findActiveProductById(id)
                .map(ProductResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm."));
    }

    @Transactional(readOnly = true)
    public ProductResponse getActiveProductBySlug(String slug) {
        return productRepository.findActiveProductBySlug(slug)
                .map(ProductResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm."));
    }
}
