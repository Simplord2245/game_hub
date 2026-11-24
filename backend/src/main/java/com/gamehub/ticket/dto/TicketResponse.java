package com.gamehub.ticket.dto;

import com.gamehub.ticket.entity.SupportTicket;
import java.time.LocalDateTime;
import java.util.List;

public record TicketResponse(
        Long ticketId,
        String ticketCode,
        String subject,
        String priority,
        String ticketStatus,
        Long orderId,
        Long userId,
        String userEmail,
        Long assignedStaffId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<TicketMessageResponse> messages
) {
    public static TicketResponse from(SupportTicket st, List<TicketMessageResponse> messages) {
        return new TicketResponse(
                st.getTicketId(),
                st.getTicketCode(),
                st.getSubject(),
                st.getPriority(),
                st.getTicketStatus(),
                st.getOrderId(),
                st.getUser().getUserId(),
                st.getUser().getEmail(),
                st.getAssignedStaffId(),
                st.getCreatedAt(),
                st.getUpdatedAt(),
                messages
        );
    }
}
