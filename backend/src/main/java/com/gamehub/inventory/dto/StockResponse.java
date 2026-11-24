package com.gamehub.inventory.dto;

public record StockResponse(
        Long productId,
        long availableStock,
        long reservedStock,
        long soldStock
) {}
