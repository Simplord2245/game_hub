package com.gamehub.admin.service;

import com.gamehub.admin.dto.ProductRequest;
import com.gamehub.category.entity.ProductCategory;
import com.gamehub.category.repository.CategoryRepository;
import com.gamehub.common.api.PageResponse;
import com.gamehub.common.exception.ResourceNotFoundException;
import com.gamehub.game.entity.Game;
import com.gamehub.game.repository.GameRepository;
import com.gamehub.product.dto.ProductResponse;
import com.gamehub.product.entity.Product;
import com.gamehub.product.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminProductService {

    private final ProductRepository productRepository;
    private final GameRepository gameRepository;
    private final CategoryRepository categoryRepository;

    public AdminProductService(ProductRepository productRepository,
                               GameRepository gameRepository,
                               CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.gameRepository = gameRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> getAllProducts(
            Long gameId, Long categoryId, String status, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), Sort.by("createdAt").descending());
        Page<Product> products = productRepository.findAllByAdminFilters(
                gameId, categoryId,
                status != null && !status.isBlank() ? status.trim().toUpperCase() : null,
                keyword != null && !keyword.isBlank() ? keyword.trim() : null,
                pageable);
        return PageResponse.from(products.map(ProductResponse::from));
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Game game = gameRepository.findById(request.gameId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy game ID: " + request.gameId()));

        ProductCategory category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục ID: " + request.categoryId()));

        if (productRepository.existsBySku(request.sku().trim())) {
            throw new IllegalArgumentException("Mã SKU '" + request.sku() + "' đã tồn tại!");
        }

        if (productRepository.existsBySlug(request.slug().trim())) {
            throw new IllegalArgumentException("Slug '" + request.slug() + "' đã tồn tại!");
        }

        if (request.salePrice() != null && request.salePrice().compareTo(request.price()) >= 0) {
            throw new IllegalArgumentException("Giá khuyến mãi phải nhỏ hơn giá gốc.");
        }

        Product product = new Product();
        product.setGame(game);
        product.setCategory(category);
        product.setSku(request.sku().trim().toUpperCase());
        product.setProductName(request.productName().trim());
        product.setSlug(request.slug().trim().toLowerCase());
        product.setProductType(request.productType().trim().toUpperCase());
        product.setPlatform(request.platform());
        product.setRegion(request.region());
        product.setServerName(request.serverName());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setSalePrice(request.salePrice());
        product.setProductStatus(request.productStatus() != null ? request.productStatus().toUpperCase() : "DRAFT");

        Product saved = productRepository.save(product);
        return ProductResponse.from(saved);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm."));

        Game game = gameRepository.findById(request.gameId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy game ID: " + request.gameId()));

        ProductCategory category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục ID: " + request.categoryId()));

        if (productRepository.existsBySkuAndProductIdNot(request.sku().trim(), id)) {
            throw new IllegalArgumentException("Mã SKU '" + request.sku() + "' đã được sử dụng!");
        }

        if (productRepository.existsBySlugAndProductIdNot(request.slug().trim(), id)) {
            throw new IllegalArgumentException("Slug '" + request.slug() + "' đã được sử dụng!");
        }

        if (request.salePrice() != null && request.salePrice().compareTo(request.price()) >= 0) {
            throw new IllegalArgumentException("Giá khuyến mãi phải nhỏ hơn giá gốc.");
        }

        product.setGame(game);
        product.setCategory(category);
        product.setSku(request.sku().trim().toUpperCase());
        product.setProductName(request.productName().trim());
        product.setSlug(request.slug().trim().toLowerCase());
        product.setProductType(request.productType().trim().toUpperCase());
        product.setPlatform(request.platform());
        product.setRegion(request.region());
        product.setServerName(request.serverName());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setSalePrice(request.salePrice());
        if (request.productStatus() != null) {
            product.setProductStatus(request.productStatus().toUpperCase());
        }

        Product saved = productRepository.save(product);
        return ProductResponse.from(saved);
    }

    @Transactional
    public ProductResponse updateStatus(Long id, String status) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm."));

        product.setProductStatus(status.trim().toUpperCase());
        Product saved = productRepository.save(product);
        return ProductResponse.from(saved);
    }
}
