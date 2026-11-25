package com.gamehub.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank(message = "Họ tên không được để trống")
        @Size(max = 120, message = "Họ tên tối đa 120 ký tự")
        String fullName,

        @Size(max = 25, message = "Số điện thoại tối đa 25 ký tự")
        String phone,

        @Size(max = 500, message = "URL ảnh đại diện tối đa 500 ký tự")
        String avatarUrl
) {}
