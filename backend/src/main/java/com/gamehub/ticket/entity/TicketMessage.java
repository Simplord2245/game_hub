package com.gamehub.ticket.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_messages")
public class TicketMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long messageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private SupportTicket ticket;

    @Column(name = "sender_user_id", nullable = false)
    private Long senderUserId;

    @Column(name = "message_content", nullable = false, columnDefinition = "TEXT")
    private String messageContent;

    @Column(name = "is_internal", nullable = false)
    private boolean isInternal = false;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public TicketMessage() { }

    public TicketMessage(SupportTicket ticket, Long senderUserId, String messageContent, boolean isInternal) {
        this.ticket = ticket;
        this.senderUserId = senderUserId;
        this.messageContent = messageContent;
        this.isInternal = isInternal;
    }

    public Long getMessageId() { return messageId; }
    public SupportTicket getTicket() { return ticket; }
    public Long getSenderUserId() { return senderUserId; }
    public String getMessageContent() { return messageContent; }
    public boolean isInternal() { return isInternal; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
