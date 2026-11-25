package com.gamehub.admin.service;

import com.gamehub.admin.dto.UserResponse;
import com.gamehub.common.api.PageResponse;
import com.gamehub.common.exception.ResourceNotFoundException;
import com.gamehub.user.entity.Role;
import com.gamehub.user.entity.User;
import com.gamehub.user.entity.UserStatus;
import com.gamehub.user.repository.RoleRepository;
import com.gamehub.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public AdminUserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getUsers(String keyword, String status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), Sort.by("userId").descending());

        UserStatus userStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                userStatus = UserStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException ignored) { }
        }

        Page<User> users = userRepository.searchUsers(
                keyword != null && !keyword.isBlank() ? keyword.trim() : null,
                userStatus,
                pageable);

        return PageResponse.from(users.map(UserResponse::from));
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng."));
        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse updateUserStatus(Long id, String status, String currentAdminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng."));

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new IllegalArgumentException("Không thể tự thay đổi trạng thái tài khoản của chính mình!");
        }

        try {
            user.setUserStatus(UserStatus.valueOf(status.trim().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Trạng thái người dùng không hợp lệ (ACTIVE, LOCKED, PENDING_VERIFICATION).");
        }

        User saved = userRepository.save(user);
        return UserResponse.from(saved);
    }

    @Transactional
    public UserResponse updateUserRoles(Long id, List<String> roleCodes) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng."));

        user.getRoles().clear();
        for (String code : roleCodes) {
            Role role = roleRepository.findByRoleCode(code.trim().toUpperCase())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò: " + code));
            user.getRoles().add(role);
        }

        User saved = userRepository.save(user);
        return UserResponse.from(saved);
    }
}
