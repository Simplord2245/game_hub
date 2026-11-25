package com.gamehub.game.dto;

import com.gamehub.game.entity.Game;
import java.time.LocalDateTime;

public record GameResponse(
        Long id,
        String name,
        String slug,
        String publisher,
        String description,
        String coverUrl,
        String status,
        LocalDateTime createdAt
) {
    public static GameResponse from(Game game) {
        return new GameResponse(
                game.getGameId(),
                game.getGameName(),
                game.getSlug(),
                game.getPublisher(),
                game.getDescription(),
                game.getCoverUrl(),
                game.getGameStatus(),
                game.getCreatedAt()
        );
    }
}
