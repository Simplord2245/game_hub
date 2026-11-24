package com.gamehub.admin.service;

import com.gamehub.admin.dto.CategoryRequest;
import com.gamehub.category.dto.CategoryResponse;
import com.gamehub.category.entity.ProductCategory;
import com.gamehub.category.repository.CategoryRepository;
import com.gamehub.common.exception.ResourceNotFoundException;
import com.gamehub.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminCategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public AdminCategoryService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryResponse::from)
                .toList();
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsBySlug(request.slug().trim())) {
            throw new IllegalArgumentException("Slug danh mục '" + request.slug() + "' đã tồn tại!");
        }

        ProductCategory category = new ProductCategory();
        category.setCategoryName(request.categoryName().trim());
        category.setSlug(request.slug().trim().toLowerCase());
        category.setDescription(request.description());
        category.setCategoryStatus(request.categoryStatus() != null ? request.categoryStatus().toUpperCase() : "ACTIVE");

        ProductCategory saved = categoryRepository.save(category);
        return CategoryResponse.from(saved);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        ProductCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục."));

        if (categoryRepository.existsByCategoryIdNotAndSlug(id, request.slug().trim())) {
            throw new IllegalArgumentException("Slug danh mục '" + request.slug() + "' đã được sử dụng!");
        }

        category.setCategoryName(request.categoryName().trim());
        category.setSlug(request.slug().trim().toLowerCase());
        category.setDescription(request.description());
        if (request.categoryStatus() != null) {
            category.setCategoryStatus(request.categoryStatus().toUpperCase());
        }

        ProductCategory saved = categoryRepository.save(category);
        return CategoryResponse.from(saved);
    }

    @Transactional
    public void deleteOrHideCategory(Long id) {
        ProductCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục."));

        long productCount = productRepository.countByCategory_CategoryId(id);
        if (productCount > 0) {
            category.setCategoryStatus("HIDDEN");
            categoryRepository.save(category);
        } else {
            categoryRepository.delete(category);
        }
    }
}
