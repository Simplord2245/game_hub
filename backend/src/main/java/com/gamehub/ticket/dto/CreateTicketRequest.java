package com.gamehub.ticket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTicketRequest(
        @NotBlank(message = "Tiêu đề không được để trống")
        @Size(max = 200, message = "Tiêu đề tối đa 200 ký tự")
        String subject,

        @NotBlank(message = "Nội dung yêu cầu không được để trống")
        @Size(max = 5000, message = "Nội dung tối đa 5000 ký tự")
        String message,

        Long orderId,

        String priority // 'LOW', 'NORMAL', 'HIGH'
) {}
