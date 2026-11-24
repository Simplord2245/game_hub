package com.gamehub.game.repository;

import com.gamehub.game.entity.Game;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface GameRepository extends JpaRepository<Game, Long> {
    Page<Game> findByGameStatus(String gameStatus, Pageable pageable);

    Page<Game> findByGameStatusAndGameNameContainingIgnoreCase(
            String gameStatus, String keyword, Pageable pageable);

    Optional<Game> findByGameIdAndGameStatus(Long gameId, String gameStatus);

    Optional<Game> findBySlugAndGameStatus(String slug, String gameStatus);

    boolean existsBySlug(String slug);

    boolean existsByGameIdNotAndSlug(Long gameId, String slug);

    @Query("SELECT g FROM Game g WHERE " +
           "(:status IS NULL OR g.gameStatus = :status) " +
           "AND (:keyword IS NULL OR LOWER(g.gameName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Game> findAllByAdminFilters(@Param("status") String status, @Param("keyword") String keyword, Pageable pageable);
}
