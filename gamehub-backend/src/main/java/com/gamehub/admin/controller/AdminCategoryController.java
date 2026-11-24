package com.gamehub.admin.controller;

import com.gamehub.admin.dto.CategoryRequest;
import com.gamehub.admin.service.AdminCategoryService;
import com.gamehub.category.dto.CategoryResponse;
import com.gamehub.common.api.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCategoryController {

    private final AdminCategoryService adminCategoryService;

    public AdminCategoryController(AdminCategoryService adminCategoryService) {
        this.adminCategoryService = adminCategoryService;
    }

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAllCategories() {
        return ApiResponse.success("Lấy danh mục thành công.",
                adminCategoryService.getAllCategories());
    }

    @PostMapping
    public ApiResponse<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        return ApiResponse.success("Thêm danh mục mới thành công.",
                adminCategoryService.createCategory(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        return ApiResponse.success("Cập nhật danh mục thành công.",
                adminCategoryService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
        adminCategoryService.deleteOrHideCategory(id);
        return ApiResponse.success("Xóa / Ẩn danh mục thành công.");
    }
}
