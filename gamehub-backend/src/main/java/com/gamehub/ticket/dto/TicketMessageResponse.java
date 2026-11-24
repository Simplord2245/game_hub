package com.gamehub.ticket.dto;

import com.gamehub.ticket.entity.TicketMessage;
import java.time.LocalDateTime;

public record TicketMessageResponse(
        Long messageId,
        Long senderUserId,
        String messageContent,
        boolean isInternal,
        LocalDateTime createdAt
) {
    public static TicketMessageResponse from(TicketMessage tm) {
        return new TicketMessageResponse(
                tm.getMessageId(),
                tm.getSenderUserId(),
                tm.getMessageContent(),
                tm.isInternal(),
                tm.getCreatedAt()
        );
    }
}
