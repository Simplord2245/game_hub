
package com.gamehub.auth.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gamehub.auth.dto.LoginRequest;
import com.gamehub.auth.dto.LoginResponse;
import com.gamehub.auth.dto.RegisterRequest;
import com.gamehub.auth.dto.RegisterResponse;
import com.gamehub.auth.service.AuthService;
import com.gamehub.common.api.ApiResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /** POST /api/auth/register — Đăng ký tài khoản mới */
    @PostMapping("/register")
    public ApiResponse<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        RegisterResponse result = authService.register(request);
        return ApiResponse.success("Đăng ký tài khoản thành công!", result);
    }

    /** POST /api/auth/login — Đăng nhập, trả về JWT */
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse result = authService.login(request);
        return ApiResponse.success("Đăng nhập thành công!", result);
    }
}

