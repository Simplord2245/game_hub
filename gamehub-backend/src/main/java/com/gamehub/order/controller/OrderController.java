package com.gamehub.order.controller;

import com.gamehub.common.api.ApiResponse;
import com.gamehub.common.api.PageResponse;
import com.gamehub.order.dto.OrderResponse;
import com.gamehub.order.dto.PlaceOrderRequest;
import com.gamehub.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ApiResponse<OrderResponse> placeOrder(
            Authentication authentication,
            @Valid @RequestBody PlaceOrderRequest request) {
        return ApiResponse.success("Đặt hàng thành công.",
                orderService.placeOrder(authentication.getName(), request));
    }

    @GetMapping
    public ApiResponse<PageResponse<OrderResponse>> getMyOrders(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success("Lấy danh sách đơn hàng thành công.",
                orderService.getMyOrders(authentication.getName(), page, size));
    }

    @GetMapping("/{orderCode}")
    public ApiResponse<OrderResponse> getMyOrderByCode(
            Authentication authentication,
            @PathVariable String orderCode) {
        return ApiResponse.success("Lấy chi tiết đơn hàng thành công.",
                orderService.getMyOrderByCode(authentication.getName(), orderCode));
    }

    @DeleteMapping("/{orderId}/cancel")
    public ApiResponse<OrderResponse> cancelOrder(
            Authentication authentication,
            @PathVariable Long orderId) {
        return ApiResponse.success("Hủy đơn hàng thành công.",
                orderService.cancelOrder(authentication.getName(), orderId));
    }
}
