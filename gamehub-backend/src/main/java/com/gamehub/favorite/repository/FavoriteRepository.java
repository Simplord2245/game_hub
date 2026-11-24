package com.gamehub.favorite.repository;

import com.gamehub.favorite.entity.Favorite;
import com.gamehub.favorite.entity.FavoriteId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FavoriteRepository extends JpaRepository<Favorite, FavoriteId> {
    @Query("SELECT f FROM Favorite f JOIN FETCH f.product p JOIN FETCH p.game WHERE f.user.userId = :userId")
    Page<Favorite> findByUser_UserId(@Param("userId") Long userId, Pageable pageable);

    boolean existsById_UserIdAndId_ProductId(Long userId, Long productId);

    void deleteById_UserIdAndId_ProductId(Long userId, Long productId);
}
