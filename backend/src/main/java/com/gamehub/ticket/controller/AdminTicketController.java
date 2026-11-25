package com.gamehub.ticket.controller;

import com.gamehub.common.api.ApiResponse;
import com.gamehub.common.api.PageResponse;
import com.gamehub.ticket.dto.ReplyTicketRequest;
import com.gamehub.ticket.dto.TicketResponse;
import com.gamehub.ticket.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/tickets")
@PreAuthorize("hasAnyRole('ADMIN','STAFF')")
public class AdminTicketController {

    private final TicketService ticketService;

    public AdminTicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public ApiResponse<PageResponse<TicketResponse>> getAllTickets(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Lấy danh sách ticket thành công.",
                ticketService.getAllTickets(status, page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<TicketResponse> getTicketDetail(@PathVariable Long id) {
        return ApiResponse.success("Lấy chi tiết ticket thành công.",
                ticketService.getTicketDetailAdmin(id));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<TicketResponse> updateTicketStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái không được để trống.");
        }
        return ApiResponse.success("Cập nhật trạng thái thành công.",
                ticketService.updateTicketStatus(id, status.trim().toUpperCase()));
    }

    @PatchMapping("/{id}/assign")
    public ApiResponse<TicketResponse> assignTicket(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        Long staffId = body.get("staffId");
        return ApiResponse.success("Phân công nhân viên thành công.",
                ticketService.assignTicket(id, staffId));
    }

    @PostMapping("/{id}/reply")
    public ApiResponse<TicketResponse> staffReply(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody ReplyTicketRequest request) {
        return ApiResponse.success("Gửi phản hồi thành công.",
                ticketService.replyToTicket(authentication.getName(), id, request, true));
    }
}
