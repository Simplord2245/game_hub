package com.gamehub.order.controller;

import com.gamehub.common.api.ApiResponse;
import com.gamehub.common.api.PageResponse;
import com.gamehub.order.dto.OrderResponse;
import com.gamehub.order.service.OrderService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@PreAuthorize("hasAnyRole('ADMIN','STAFF')")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ApiResponse<PageResponse<OrderResponse>> getAllOrders(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Lấy danh sách đơn hàng thành công.",
                orderService.getAllOrders(status, page, size));
    }

    @PatchMapping("/{orderId}/status")
    public ApiResponse<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái mới không được để trống.");
        }
        return ApiResponse.success("Cập nhật trạng thái đơn hàng thành công.",
                orderService.updateOrderStatus(orderId, status.trim().toUpperCase()));
    }
}
