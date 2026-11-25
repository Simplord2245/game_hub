package com.gamehub.user.dto;

import com.gamehub.user.entity.Role;
import com.gamehub.user.entity.User;
import java.time.LocalDateTime;
import java.util.List;

public record UserProfileResponse(
        Long userId,
        String fullName,
        String email,
        String phone,
        String avatarUrl,
        String userStatus,
        List<String> roles,
        LocalDateTime createdAt
) {
    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getAvatarUrl(),
                user.getUserStatus().name(),
                user.getRoles().stream().map(Role::getRoleCode).sorted().toList(),
                user.getCreatedAt()
        );
    }
}
