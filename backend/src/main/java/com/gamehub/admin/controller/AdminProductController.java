package com.gamehub.admin.controller;

import com.gamehub.admin.dto.ProductRequest;
import com.gamehub.admin.service.AdminProductService;
import com.gamehub.common.api.ApiResponse;
import com.gamehub.common.api.PageResponse;
import com.gamehub.product.dto.ProductResponse;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasAnyRole('ADMIN','STAFF')")
public class AdminProductController {

    private final AdminProductService adminProductService;

    public AdminProductController(AdminProductService adminProductService) {
        this.adminProductService = adminProductService;
    }

    @GetMapping
    public ApiResponse<PageResponse<ProductResponse>> getAllProducts(
            @RequestParam(required = false) Long gameId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Lấy danh sách sản phẩm thành công.",
                adminProductService.getAllProducts(gameId, categoryId, status, keyword, page, size));
    }

    @PostMapping
    public ApiResponse<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return ApiResponse.success("Thêm sản phẩm mới thành công.",
                adminProductService.createProduct(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ApiResponse.success("Cập nhật sản phẩm thành công.",
                adminProductService.updateProduct(id, request));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<ProductResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái mới không được để trống.");
        }
        return ApiResponse.success("Cập nhật trạng thái thành công.",
                adminProductService.updateStatus(id, status));
    }
}
