package com.gamehub.admin.controller;

import com.gamehub.admin.dto.UserResponse;
import com.gamehub.admin.service.AdminUserService;
import com.gamehub.common.api.ApiResponse;
import com.gamehub.common.api.PageResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    public ApiResponse<PageResponse<UserResponse>> getUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Lấy danh sách người dùng thành công.",
                adminUserService.getUsers(keyword, status, page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getUserById(@PathVariable Long id) {
        return ApiResponse.success("Lấy thông tin người dùng thành công.",
                adminUserService.getUserById(id));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<UserResponse> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái không được để trống.");
        }
        return ApiResponse.success("Cập nhật trạng thái người dùng thành công.",
                adminUserService.updateUserStatus(id, status, authentication.getName()));
    }

    @PutMapping("/{id}/roles")
    public ApiResponse<UserResponse> updateUserRoles(
            @PathVariable Long id,
            @RequestBody Map<String, List<String>> body) {
        List<String> roles = body.get("roles");
        if (roles == null || roles.isEmpty()) {
            throw new IllegalArgumentException("Danh sách vai trò không được để trống.");
        }
        return ApiResponse.success("Cập nhật vai trò người dùng thành công.",
                adminUserService.updateUserRoles(id, roles));
    }
}
