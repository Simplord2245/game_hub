package com.gamehub.ticket.repository;

import com.gamehub.ticket.entity.SupportTicket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TicketRepository extends JpaRepository<SupportTicket, Long> {
    Page<SupportTicket> findByUser_UserId(Long userId, Pageable pageable);

    Optional<SupportTicket> findByTicketIdAndUser_UserId(Long ticketId, Long userId);

    @Query("SELECT t FROM SupportTicket t WHERE (:status IS NULL OR t.ticketStatus = :status)")
    Page<SupportTicket> findAllByStatus(@Param("status") String status, Pageable pageable);
}
