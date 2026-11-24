package com.gamehub.category.service;

import com.gamehub.category.dto.CategoryResponse;
import com.gamehub.category.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getActiveCategories() {
        return categoryRepository.findByCategoryStatusOrderByCategoryNameAsc("ACTIVE")
                .stream().map(CategoryResponse::from).toList();
    }
}
