package com.gamehub.product.repository;

import com.gamehub.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query(value = """
            SELECT p FROM Product p
            JOIN FETCH p.game g
            JOIN FETCH p.category c
            WHERE p.productStatus = 'ACTIVE'
              AND (:gameId IS NULL OR g.gameId = :gameId)
              AND (:categoryId IS NULL OR c.categoryId = :categoryId)
              AND (:keyword IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """,
            countQuery = """
            SELECT COUNT(p) FROM Product p
            WHERE p.productStatus = 'ACTIVE'
              AND (:gameId IS NULL OR p.game.gameId = :gameId)
              AND (:categoryId IS NULL OR p.category.categoryId = :categoryId)
              AND (:keyword IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """)
    Page<Product> searchActiveProducts(
            @Param("gameId") Long gameId,
            @Param("categoryId") Long categoryId,
            @Param("keyword") String keyword,
            Pageable pageable);

    @Query("""
            SELECT p FROM Product p
            JOIN FETCH p.game
            JOIN FETCH p.category
            WHERE p.productId = :id AND p.productStatus = 'ACTIVE'
            """)
    Optional<Product> findActiveProductById(@Param("id") Long id);

    @Query("""
            SELECT p FROM Product p
            JOIN FETCH p.game
            JOIN FETCH p.category
            WHERE p.slug = :slug AND p.productStatus = 'ACTIVE'
            """)
    Optional<Product> findActiveProductBySlug(@Param("slug") String slug);

    boolean existsBySku(String sku);

    boolean existsBySlug(String slug);

    boolean existsBySkuAndProductIdNot(String sku, Long productId);

    boolean existsBySlugAndProductIdNot(String slug, Long productId);

    long countByGame_GameId(Long gameId);

    long countByCategory_CategoryId(Long categoryId);

    @Query(value = """
            SELECT p FROM Product p
            JOIN FETCH p.game g
            JOIN FETCH p.category c
            WHERE (:gameId IS NULL OR g.gameId = :gameId)
              AND (:categoryId IS NULL OR c.categoryId = :categoryId)
              AND (:status IS NULL OR p.productStatus = :status)
              AND (:keyword IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """,
            countQuery = """
            SELECT COUNT(p) FROM Product p
            WHERE (:gameId IS NULL OR p.game.gameId = :gameId)
              AND (:categoryId IS NULL OR p.category.categoryId = :categoryId)
              AND (:status IS NULL OR p.productStatus = :status)
              AND (:keyword IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """)
    Page<Product> findAllByAdminFilters(
            @Param("gameId") Long gameId,
            @Param("categoryId") Long categoryId,
            @Param("status") String status,
            @Param("keyword") String keyword,
            Pageable pageable);
}
