package com.gamehub.game.service;

import com.gamehub.common.api.PageResponse;
import com.gamehub.common.exception.ResourceNotFoundException;
import com.gamehub.game.dto.GameResponse;
import com.gamehub.game.entity.Game;
import com.gamehub.game.repository.GameRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GameService {
    private static final String ACTIVE = "ACTIVE";
    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<GameResponse> getActiveGames(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                Math.min(Math.max(size, 1), 50),
                Sort.by("gameName").ascending()
        );

        var result = (keyword == null || keyword.isBlank())
                ? gameRepository.findByGameStatus(ACTIVE, pageable)
                : gameRepository.findByGameStatusAndGameNameContainingIgnoreCase(
                        ACTIVE, keyword.trim(), pageable);

        return PageResponse.from(result.map(GameResponse::from));
    }

    @Transactional(readOnly = true)
    public GameResponse getActiveGameById(Long id) {
        Game game = gameRepository.findByGameIdAndGameStatus(id, ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy game."));
        return GameResponse.from(game);
    }

    @Transactional(readOnly = true)
    public GameResponse getActiveGameBySlug(String slug) {
        Game game = gameRepository.findBySlugAndGameStatus(slug, ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy game."));
        return GameResponse.from(game);
    }
}
