package com.gamehub.ticket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReplyTicketRequest(
        @NotBlank(message = "Nội dung phản hồi không được để trống")
        @Size(max = 5000, message = "Nội dung tối đa 5000 ký tự")
        String message,

        boolean isInternal
) {}
