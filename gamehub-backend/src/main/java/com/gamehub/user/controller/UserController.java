package com.gamehub.user.controller;

import com.gamehub.common.api.ApiResponse;
import com.gamehub.user.dto.ChangePasswordRequest;
import com.gamehub.user.dto.UpdateProfileRequest;
import com.gamehub.user.dto.UserProfileResponse;
import com.gamehub.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ApiResponse<UserProfileResponse> getProfile(Authentication authentication) {
        return ApiResponse.success("Lấy thông tin cá nhân thành công.",
                userService.getProfile(authentication.getName()));
    }

    @PutMapping
    public ApiResponse<UserProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ApiResponse.success("Cập nhật thông tin thành công.",
                userService.updateProfile(authentication.getName(), request));
    }

    @PatchMapping("/password")
    public ApiResponse<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(authentication.getName(), request);
        return ApiResponse.success("Đổi mật khẩu thành công.");
    }
}
