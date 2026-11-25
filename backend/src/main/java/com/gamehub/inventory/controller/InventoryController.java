package com.gamehub.inventory.controller;

import com.gamehub.common.api.ApiResponse;
import com.gamehub.common.api.PageResponse;
import com.gamehub.inventory.dto.AddInventoryRequest;
import com.gamehub.inventory.dto.InventoryResponse;
import com.gamehub.inventory.dto.StockResponse;
import com.gamehub.inventory.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // Public: xem số lượng tồn kho
    @GetMapping("/products/{productId}/stock")
    public ApiResponse<StockResponse> getProductStock(@PathVariable Long productId) {
        return ApiResponse.success("Lấy thông tin tồn kho thành công.",
                inventoryService.getProductStock(productId));
    }

    // Staff/Admin: Thêm hàng vào kho
    @PostMapping("/admin/inventory")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ApiResponse<InventoryResponse> addInventory(
            @Valid @RequestBody AddInventoryRequest request) {
        return ApiResponse.success("Nhập kho thành công.",
                inventoryService.addInventoryItem(request));
    }

    // Staff/Admin: Xem danh sách đơn vị kho của sản phẩm
    @GetMapping("/admin/inventory/{productId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ApiResponse<PageResponse<InventoryResponse>> getInventoryByProduct(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Lấy danh sách kho thành công.",
                inventoryService.getInventoryByProduct(productId, page, size));
    }
}
