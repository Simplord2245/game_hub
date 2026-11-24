package com.gamehub.game.controller;

import com.gamehub.common.api.ApiResponse;
import com.gamehub.common.api.PageResponse;
import com.gamehub.game.dto.GameResponse;
import com.gamehub.game.service.GameService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/games")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping
    public ApiResponse<PageResponse<GameResponse>> getGames(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ApiResponse.success("Lấy danh sách game thành công.",
                gameService.getActiveGames(keyword, page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<GameResponse> getGameById(@PathVariable Long id) {
        return ApiResponse.success("Lấy thông tin game thành công.",
                gameService.getActiveGameById(id));
    }

    @GetMapping("/slug/{slug}")
    public ApiResponse<GameResponse> getGameBySlug(@PathVariable String slug) {
        return ApiResponse.success("Lấy thông tin game thành công.",
                gameService.getActiveGameBySlug(slug));
    }
}
