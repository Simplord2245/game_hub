package com.gamehub.inventory.service;

import com.gamehub.common.api.PageResponse;
import com.gamehub.common.exception.ResourceNotFoundException;
import com.gamehub.inventory.dto.AddInventoryRequest;
import com.gamehub.inventory.dto.InventoryResponse;
import com.gamehub.inventory.dto.StockResponse;
import com.gamehub.inventory.entity.ProductInventory;
import com.gamehub.inventory.repository.InventoryRepository;
import com.gamehub.product.entity.Product;
import com.gamehub.product.repository.ProductRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;

    public InventoryService(InventoryRepository inventoryRepository,
                            ProductRepository productRepository) {
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public InventoryResponse addInventoryItem(AddInventoryRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm."));

        // Mã hóa Base64 đơn giản cho secret payload theo quy định schema (có thể thay bằng AES)
        String encodedSecret = Base64.getEncoder().encodeToString(request.secretPayload().getBytes());

        ProductInventory item = new ProductInventory(product, request.inventoryCode(), encodedSecret, request.displayNote());
        ProductInventory saved = inventoryRepository.save(item);
        return InventoryResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public StockResponse getProductStock(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Không tìm thấy sản phẩm.");
        }
        long available = inventoryRepository.countAvailableStock(productId);
        long reserved = inventoryRepository.countReservedStock(productId);
        long sold = inventoryRepository.countSoldStock(productId);
        return new StockResponse(productId, available, reserved, sold);
    }

    @Transactional(readOnly = true)
    public PageResponse<InventoryResponse> getInventoryByProduct(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), Sort.by("createdAt").descending());
        var result = inventoryRepository.findByProduct_ProductId(productId, pageable);
        return PageResponse.from(result.map(InventoryResponse::from));
    }

    // Các hàm nội bộ phục vụ OrderService
    @Transactional
    public void reserveItems(Long productId, int quantity, Long orderItemId, LocalDateTime deadline) {
        Pageable limit = PageRequest.of(0, quantity);
        List<ProductInventory> available = inventoryRepository
                .findByProduct_ProductIdAndInventoryStatusOrderByCreatedAtAsc(productId, "AVAILABLE", limit);

        if (available.size() < quantity) {
            throw new IllegalArgumentException("Không đủ hàng trong kho cho sản phẩm ID " + productId);
        }

        for (ProductInventory item : available) {
            item.setInventoryStatus("RESERVED");
            item.setOrderItemId(orderItemId);
            item.setReservedUntil(deadline);
            inventoryRepository.save(item);
        }
    }

    @Transactional
    public void releaseReservation(Long orderItemId) {
        List<ProductInventory> reserved = inventoryRepository.findByOrderItemId(orderItemId);
        for (ProductInventory item : reserved) {
            if ("RESERVED".equals(item.getInventoryStatus())) {
                item.setInventoryStatus("AVAILABLE");
                item.setOrderItemId(null);
                item.setReservedUntil(null);
                inventoryRepository.save(item);
            }
        }
    }

    @Transactional
    public void markAsSold(Long orderItemId) {
        List<ProductInventory> reserved = inventoryRepository.findByOrderItemId(orderItemId);
        for (ProductInventory item : reserved) {
            item.setInventoryStatus("SOLD");
            item.setSoldAt(LocalDateTime.now());
            inventoryRepository.save(item);
        }
    }

    @Transactional(readOnly = true)
    public List<String> getDeliveredSecrets(Long orderItemId) {
        List<ProductInventory> items = inventoryRepository.findByOrderItemId(orderItemId);
        return items.stream()
                .filter(i -> "SOLD".equals(i.getInventoryStatus()))
                .map(i -> new String(Base64.getDecoder().decode(i.getSecretPayloadEncrypted())))
                .toList();
    }
}
