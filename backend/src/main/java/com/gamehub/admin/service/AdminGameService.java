package com.gamehub.admin.service;

import com.gamehub.admin.dto.GameRequest;
import com.gamehub.common.api.PageResponse;
import com.gamehub.common.exception.ResourceNotFoundException;
import com.gamehub.game.dto.GameResponse;
import com.gamehub.game.entity.Game;
import com.gamehub.game.repository.GameRepository;
import com.gamehub.product.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminGameService {

    private final GameRepository gameRepository;
    private final ProductRepository productRepository;

    public AdminGameService(GameRepository gameRepository, ProductRepository productRepository) {
        this.gameRepository = gameRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<GameResponse> getAllGames(String status, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), Sort.by("gameName").ascending());
        Page<Game> games = gameRepository.findAllByAdminFilters(
                status != null && !status.isBlank() ? status.trim().toUpperCase() : null,
                keyword != null && !keyword.isBlank() ? keyword.trim() : null,
                pageable);
        return PageResponse.from(games.map(GameResponse::from));
    }

    @Transactional
    public GameResponse createGame(GameRequest request) {
        if (gameRepository.existsBySlug(request.slug().trim())) {
            throw new IllegalArgumentException("Slug game '" + request.slug() + "' đã tồn tại!");
        }

        Game game = new Game();
        game.setGameName(request.gameName().trim());
        game.setSlug(request.slug().trim().toLowerCase());
        game.setPublisher(request.publisher());
        game.setDescription(request.description());
        game.setCoverUrl(request.coverUrl());
        game.setGameStatus(request.gameStatus() != null ? request.gameStatus().toUpperCase() : "ACTIVE");

        Game saved = gameRepository.save(game);
        return GameResponse.from(saved);
    }

    @Transactional
    public GameResponse updateGame(Long id, GameRequest request) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy game."));

        if (gameRepository.existsByGameIdNotAndSlug(id, request.slug().trim())) {
            throw new IllegalArgumentException("Slug game '" + request.slug() + "' đã được sử dụng!");
        }

        game.setGameName(request.gameName().trim());
        game.setSlug(request.slug().trim().toLowerCase());
        game.setPublisher(request.publisher());
        game.setDescription(request.description());
        game.setCoverUrl(request.coverUrl());
        if (request.gameStatus() != null) {
            game.setGameStatus(request.gameStatus().toUpperCase());
        }

        Game saved = gameRepository.save(game);
        return GameResponse.from(saved);
    }

    @Transactional
    public void deleteOrHideGame(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy game."));

        long productCount = productRepository.countByGame_GameId(id);
        if (productCount > 0) {
            // Nếu có sản phẩm liên kết -> chuyển sang HIDDEN
            game.setGameStatus("HIDDEN");
            gameRepository.save(game);
        } else {
            gameRepository.delete(game);
        }
    }
}
