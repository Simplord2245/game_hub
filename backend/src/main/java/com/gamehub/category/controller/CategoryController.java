package com.gamehub.category.controller;

import com.gamehub.category.dto.CategoryResponse;
import com.gamehub.category.service.CategoryService;
import com.gamehub.common.api.ApiResponse;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getCategories() {
        return ApiResponse.success("Lấy danh mục sản phẩm thành công.",
                categoryService.getActiveCategories());
    }
}
