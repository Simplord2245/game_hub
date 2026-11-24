package com.gamehub.order.dto;

import jakarta.validation.constraints.Size;

public record PlaceOrderRequest(
        String couponCode,

        @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
        String customerNote
) {}
