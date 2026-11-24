package com.gamehub.ticket.controller;

import com.gamehub.common.api.ApiResponse;
import com.gamehub.common.api.PageResponse;
import com.gamehub.ticket.dto.CreateTicketRequest;
import com.gamehub.ticket.dto.ReplyTicketRequest;
import com.gamehub.ticket.dto.TicketResponse;
import com.gamehub.ticket.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ApiResponse<TicketResponse> createTicket(
            Authentication authentication,
            @Valid @RequestBody CreateTicketRequest request) {
        return ApiResponse.success("Tạo yêu cầu hỗ trợ thành công.",
                ticketService.createTicket(authentication.getName(), request));
    }

    @GetMapping
    public ApiResponse<PageResponse<TicketResponse>> getMyTickets(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success("Lấy danh sách ticket thành công.",
                ticketService.getMyTickets(authentication.getName(), page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<TicketResponse> getMyTicketDetail(
            Authentication authentication,
            @PathVariable Long id) {
        return ApiResponse.success("Lấy chi tiết ticket thành công.",
                ticketService.getMyTicketDetail(authentication.getName(), id));
    }

    @PostMapping("/{id}/reply")
    public ApiResponse<TicketResponse> replyToTicket(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody ReplyTicketRequest request) {
        return ApiResponse.success("Gửi phản hồi thành công.",
                ticketService.replyToTicket(authentication.getName(), id, request, false));
    }
}
