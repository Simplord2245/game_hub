package com.gamehub.cart.controller;

import com.gamehub.cart.dto.CartItemRequest;
import com.gamehub.cart.dto.CartResponse;
import com.gamehub.cart.service.CartService;
import com.gamehub.common.api.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ApiResponse<CartResponse> getCart(Authentication authentication) {
        return ApiResponse.success("Lấy thông tin giỏ hàng thành công.",
                cartService.getCartResponse(authentication.getName()));
    }

    @PostMapping("/items")
    public ApiResponse<CartResponse> addItem(
            Authentication authentication,
            @Valid @RequestBody CartItemRequest request) {
        return ApiResponse.success("Thêm vào giỏ hàng thành công.",
                cartService.addItem(authentication.getName(), request));
    }

    @PutMapping("/items/{cartItemId}")
    public ApiResponse<CartResponse> updateItem(
            Authentication authentication,
            @PathVariable Long cartItemId,
            @RequestBody Map<String, Integer> body) {
        int quantity = body.getOrDefault("quantity", 1);
        return ApiResponse.success("Cập nhật giỏ hàng thành công.",
                cartService.updateItem(authentication.getName(), cartItemId, quantity));
    }

    @DeleteMapping("/items/{cartItemId}")
    public ApiResponse<CartResponse> removeItem(
            Authentication authentication,
            @PathVariable Long cartItemId) {
        return ApiResponse.success("Đã xóa sản phẩm khỏi giỏ hàng.",
                cartService.removeItem(authentication.getName(), cartItemId));
    }

    @DeleteMapping
    public ApiResponse<Void> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ApiResponse.success("Đã làm trống giỏ hàng.");
    }
}
