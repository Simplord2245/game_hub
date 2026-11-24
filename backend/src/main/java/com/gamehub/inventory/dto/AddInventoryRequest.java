package com.gamehub.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AddInventoryRequest(
        @NotNull(message = "ID sản phẩm không được để trống")
        Long productId,

        @Size(max = 80, message = "Mã kho tối đa 80 ký tự")
        String inventoryCode,

        @NotBlank(message = "Nội dung số / thông tin kích hoạt không được để trống")
        String secretPayload,

        @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
        String displayNote
) {}
