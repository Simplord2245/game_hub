package com.gamehub.favorite.service;

import com.gamehub.common.api.PageResponse;
import com.gamehub.common.exception.ResourceNotFoundException;
import com.gamehub.favorite.dto.FavoriteResponse;
import com.gamehub.favorite.entity.Favorite;
import com.gamehub.favorite.repository.FavoriteRepository;
import com.gamehub.product.entity.Product;
import com.gamehub.product.repository.ProductRepository;
import com.gamehub.user.entity.User;
import com.gamehub.user.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public FavoriteService(FavoriteRepository favoriteRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository) {
        this.favoriteRepository = favoriteRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void addFavorite(String email, Long productId) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng."));

        if (favoriteRepository.existsById_UserIdAndId_ProductId(user.getUserId(), productId)) {
            return; // Đã yêu thích rồi
        }

        Product product = productRepository.findActiveProductById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm."));

        Favorite favorite = new Favorite(user, product);
        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(String email, Long productId) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng."));

        favoriteRepository.deleteById_UserIdAndId_ProductId(user.getUserId(), productId);
    }

    @Transactional(readOnly = true)
    public PageResponse<FavoriteResponse> getFavorites(String email, int page, int size) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng."));

        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), Sort.by("createdAt").descending());
        var result = favoriteRepository.findByUser_UserId(user.getUserId(), pageable);
        return PageResponse.from(result.map(FavoriteResponse::from));
    }

    @Transactional(readOnly = true)
    public boolean isFavorite(String email, Long productId) {
        return userRepository.findByEmailIgnoreCase(email)
                .map(user -> favoriteRepository.existsById_UserIdAndId_ProductId(user.getUserId(), productId))
                .orElse(false);
    }
}
