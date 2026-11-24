package com.gamehub.auth.dto;

import java.util.List;

public record LoginResponse(
    Long userId,
    String fullName,
    String email,
    List<String> roles,
    String status,
    String accessToken,
    String tokenType
) {
    public static LoginResponse of(Long userId, String fullName, String email,
                                   List<String> roles, String status, String token) {
        return new LoginResponse(userId, fullName, email, roles, status, token, "Bearer");
    }
}
