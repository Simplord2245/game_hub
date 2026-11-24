package com.gamehub.category.repository;

import com.gamehub.category.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<ProductCategory, Long> {
    List<ProductCategory> findByCategoryStatusOrderByCategoryNameAsc(String categoryStatus);

    Optional<ProductCategory> findByCategoryIdAndCategoryStatus(Long categoryId, String categoryStatus);

    boolean existsBySlug(String slug);

    boolean existsByCategoryIdNotAndSlug(Long categoryId, String slug);
}
