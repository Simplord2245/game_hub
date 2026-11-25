package com.gamehub.admin.controller;

import com.gamehub.admin.dto.GameRequest;
import com.gamehub.admin.service.AdminGameService;
import com.gamehub.common.api.ApiResponse;
import com.gamehub.common.api.PageResponse;
import com.gamehub.game.dto.GameResponse;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/games")
@PreAuthorize("hasRole('ADMIN')")
public class AdminGameController {

    private final AdminGameService adminGameService;

    public AdminGameController(AdminGameService adminGameService) {
        this.adminGameService = adminGameService;
    }

    @GetMapping
    public ApiResponse<PageResponse<GameResponse>> getAllGames(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Lấy danh sách game thành công.",
                adminGameService.getAllGames(status, keyword, page, size));
    }

    @PostMapping
    public ApiResponse<GameResponse> createGame(@Valid @RequestBody GameRequest request) {
        return ApiResponse.success("Thêm game mới thành công.",
                adminGameService.createGame(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<GameResponse> updateGame(
            @PathVariable Long id,
            @Valid @RequestBody GameRequest request) {
        return ApiResponse.success("Cập nhật game thành công.",
                adminGameService.updateGame(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteGame(@PathVariable Long id) {
        adminGameService.deleteOrHideGame(id);
        return ApiResponse.success("Xóa / Ẩn game thành công.");
    }
}
