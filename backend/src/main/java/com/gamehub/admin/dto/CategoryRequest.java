package com.gamehub.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank(message = "Tên danh mục không được để trống")
        @Size(max = 100, message = "Tên danh mục tối đa 100 ký tự")
        String categoryName,

        @NotBlank(message = "Slug danh mục không được để trống")
        @Size(max = 120, message = "Slug tối đa 120 ký tự")
        String slug,

        @Size(max = 500, message = "Mô tả tối đa 500 ký tự")
        String description,

        String categoryStatus // 'ACTIVE', 'HIDDEN'
) {}
