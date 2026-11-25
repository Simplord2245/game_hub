
package com.gamehub.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

    @NotBlank(message = "Họ tên không được để trống")
    @Size(max = 120, message = "Họ tên tối đa 120 ký tự")
    String fullName,

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    @Size(max = 190)
    String email,

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, max = 64,
          message = "Mật khẩu phải có từ 8 đến 64 ký tự")
    String password,

    @Size(max = 25, message = "Số điện thoại tối đa 25 ký tự")
    String phone

) {}
