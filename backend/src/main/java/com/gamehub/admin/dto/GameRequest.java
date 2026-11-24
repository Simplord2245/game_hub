package com.gamehub.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record GameRequest(
        @NotBlank(message = "Tên game không được để trống")
        @Size(max = 160, message = "Tên game tối đa 160 ký tự")
        String gameName,

        @NotBlank(message = "Slug game không được để trống")
        @Size(max = 180, message = "Slug tối đa 180 ký tự")
        String slug,

        @Size(max = 160, message = "Nhà phát hành tối đa 160 ký tự")
        String publisher,

        String description,

        @Size(max = 500, message = "URL ảnh bìa tối đa 500 ký tự")
        String coverUrl,

        String gameStatus // 'ACTIVE', 'HIDDEN'
) {}
