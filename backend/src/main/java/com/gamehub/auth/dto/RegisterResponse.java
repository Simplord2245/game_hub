package com.gamehub.auth.dto;

import java.util.List;

public record RegisterResponse(
    Long userId,
    String fullName,
    String email,
    String phone,
    List<String> roles,
    String status
) {}
