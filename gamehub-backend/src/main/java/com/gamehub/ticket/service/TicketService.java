package com.gamehub.ticket.service;

import com.gamehub.common.api.PageResponse;
import com.gamehub.common.exception.ResourceNotFoundException;
import com.gamehub.order.repository.OrderRepository;
import com.gamehub.ticket.dto.*;
import com.gamehub.ticket.entity.SupportTicket;
import com.gamehub.ticket.entity.TicketMessage;
import com.gamehub.ticket.repository.TicketMessageRepository;
import com.gamehub.ticket.repository.TicketRepository;
import com.gamehub.user.entity.User;
import com.gamehub.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public TicketService(TicketRepository ticketRepository,
                         TicketMessageRepository messageRepository,
                         UserRepository userRepository,
                         OrderRepository orderRepository) {
        this.ticketRepository = ticketRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public TicketResponse createTicket(String email, CreateTicketRequest request) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng."));

        Long validOrderId = null;
        if (request.orderId() != null && orderRepository.existsById(request.orderId())) {
            validOrderId = request.orderId();
        }

        SupportTicket ticket = new SupportTicket();
        ticket.setTicketCode("TK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        ticket.setUser(user);
        ticket.setSubject(request.subject().trim());
        ticket.setOrderId(validOrderId);
        ticket.setPriority(request.priority() != null ? request.priority().toUpperCase() : "NORMAL");
        ticket.setTicketStatus("OPEN");

        SupportTicket savedTicket = ticketRepository.save(ticket);

        TicketMessage msg = new TicketMessage(savedTicket, user.getUserId(), request.message().trim(), false);
        messageRepository.save(msg);

        return TicketResponse.from(savedTicket, List.of(TicketMessageResponse.from(msg)));
    }

    @Transactional(readOnly = true)
    public PageResponse<TicketResponse> getMyTickets(String email, int page, int size) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng."));

        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), Sort.by("createdAt").descending());
        Page<SupportTicket> tickets = ticketRepository.findByUser_UserId(user.getUserId(), pageable);

        return PageResponse.from(tickets.map(t -> TicketResponse.from(t, null)));
    }

    @Transactional(readOnly = true)
    public TicketResponse getMyTicketDetail(String email, Long ticketId) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng."));

        SupportTicket ticket = ticketRepository.findByTicketIdAndUser_UserId(ticketId, user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ticket hỗ trợ."));

        List<TicketMessageResponse> messages = messageRepository.findByTicket_TicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .filter(m -> !m.isInternal()) // Khách không xem tin nội bộ
                .map(TicketMessageResponse::from)
                .toList();

        return TicketResponse.from(ticket, messages);
    }

    @Transactional
    public TicketResponse replyToTicket(String email, Long ticketId, ReplyTicketRequest request, boolean isStaff) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng."));

        SupportTicket ticket = isStaff
                ? ticketRepository.findById(ticketId).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ticket."))
                : ticketRepository.findByTicketIdAndUser_UserId(ticketId, user.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ticket của bạn."));

        boolean isInternal = isStaff && request.isInternal();
        TicketMessage msg = new TicketMessage(ticket, user.getUserId(), request.message().trim(), isInternal);
        messageRepository.save(msg);

        // Khách phản hồi thì mở lại nếu ticket đang RESOLVED/CLOSED
        if (!isStaff && ("RESOLVED".equals(ticket.getTicketStatus()) || "CLOSED".equals(ticket.getTicketStatus()))) {
            ticket.setTicketStatus("OPEN");
            ticketRepository.save(ticket);
        }

        List<TicketMessageResponse> messages = messageRepository.findByTicket_TicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .filter(m -> isStaff || !m.isInternal())
                .map(TicketMessageResponse::from)
                .toList();

        return TicketResponse.from(ticket, messages);
    }

    // Admin / Staff methods
    @Transactional(readOnly = true)
    public PageResponse<TicketResponse> getAllTickets(String status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), Sort.by("createdAt").descending());
        Page<SupportTicket> tickets = ticketRepository.findAllByStatus(status, pageable);
        return PageResponse.from(tickets.map(t -> TicketResponse.from(t, null)));
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicketDetailAdmin(Long ticketId) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ticket."));

        List<TicketMessageResponse> messages = messageRepository.findByTicket_TicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .map(TicketMessageResponse::from)
                .toList();

        return TicketResponse.from(ticket, messages);
    }

    @Transactional
    public TicketResponse updateTicketStatus(Long ticketId, String newStatus) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ticket."));

        ticket.setTicketStatus(newStatus);
        ticketRepository.save(ticket);
        return getTicketDetailAdmin(ticketId);
    }

    @Transactional
    public TicketResponse assignTicket(Long ticketId, Long staffId) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ticket."));

        ticket.setAssignedStaffId(staffId);
        ticketRepository.save(ticket);
        return getTicketDetailAdmin(ticketId);
    }
}
