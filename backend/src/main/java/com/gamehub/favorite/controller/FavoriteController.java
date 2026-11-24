package com.gamehub.favorite.controller;

import com.gamehub.common.api.ApiResponse;
import com.gamehub.common.api.PageResponse;
import com.gamehub.favorite.dto.FavoriteResponse;
import com.gamehub.favorite.service.FavoriteService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public ApiResponse<PageResponse<FavoriteResponse>> getFavorites(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ApiResponse.success("Lấy danh sách yêu thích thành công.",
                favoriteService.getFavorites(authentication.getName(), page, size));
    }

    @PostMapping("/{productId}")
    public ApiResponse<Void> addFavorite(
            Authentication authentication,
            @PathVariable Long productId) {
        favoriteService.addFavorite(authentication.getName(), productId);
        return ApiResponse.success("Đã thêm vào danh sách yêu thích.");
    }

    @DeleteMapping("/{productId}")
    public ApiResponse<Void> removeFavorite(
            Authentication authentication,
            @PathVariable Long productId) {
        favoriteService.removeFavorite(authentication.getName(), productId);
        return ApiResponse.success("Đã xóa khỏi danh sách yêu thích.");
    }

    @GetMapping("/{productId}/check")
    public ApiResponse<Map<String, Boolean>> checkFavorite(
            Authentication authentication,
            @PathVariable Long productId) {
        boolean isFav = favoriteService.isFavorite(authentication.getName(), productId);
        return ApiResponse.success("Kiểm tra trạng thái yêu thích.", Map.of("isFavorite", isFav));
    }
}
