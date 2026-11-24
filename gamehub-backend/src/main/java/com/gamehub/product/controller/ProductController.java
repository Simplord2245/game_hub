package com.gamehub.product.controller;

import com.gamehub.common.api.ApiResponse;
import com.gamehub.common.api.PageResponse;
import com.gamehub.product.dto.ProductResponse;
import com.gamehub.product.service.ProductService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ApiResponse<PageResponse<ProductResponse>> getProducts(
            @RequestParam(required = false) Long gameId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "latest") String sortBy) {
        return ApiResponse.success("Lấy danh sách sản phẩm thành công.",
                productService.getActiveProducts(gameId, categoryId, keyword,
                        page, size, sortBy));
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProductById(@PathVariable Long id) {
        return ApiResponse.success("Lấy thông tin sản phẩm thành công.",
                productService.getActiveProductById(id));
    }

    @GetMapping("/slug/{slug}")
    public ApiResponse<ProductResponse> getProductBySlug(@PathVariable String slug) {
        return ApiResponse.success("Lấy thông tin sản phẩm thành công.",
                productService.getActiveProductBySlug(slug));
    }
}
