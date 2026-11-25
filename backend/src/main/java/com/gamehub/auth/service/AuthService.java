
package com.gamehub.auth.service;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gamehub.auth.dto.LoginRequest;
import com.gamehub.auth.dto.LoginResponse;
import com.gamehub.auth.dto.RegisterRequest;
import com.gamehub.auth.dto.RegisterResponse;
import com.gamehub.security.JwtUtil;
import com.gamehub.user.entity.Role;
import com.gamehub.user.entity.User;
import com.gamehub.user.entity.UserStatus;
import com.gamehub.user.repository.RoleRepository;
import com.gamehub.user.repository.UserRepository;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ─── ĐĂNG KÝ ───────────────────────────────────────────────────────────────

    @Transactional
    public RegisterResponse register(RegisterRequest request) {

        // 1. Chuẩn hóa email
        String email = request.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        // 2. Kiểm tra email đã tồn tại
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email đã được sử dụng!");
        }

        // 3. Chuẩn hóa và kiểm tra số điện thoại
        String phone = request.phone();
        if (phone != null) {
            phone = phone.trim();
            if (phone.isEmpty()) phone = null;
        }
        if (phone != null && userRepository.existsByPhone(phone)) {
            throw new IllegalArgumentException("Số điện thoại đã được sử dụng!");
        }

        // 4. Kiểm tra độ dài mật khẩu theo byte UTF-8
        if (request.password().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalArgumentException(
                    "Mật khẩu quá dài đối với bộ mã hóa BCrypt.");
        }

        // 5. Lấy role CUSTOMER từ database
        Role customerRole = roleRepository.findByRoleCode("CUSTOMER")
                .orElseThrow(() -> new IllegalStateException(
                        "Không tìm thấy role CUSTOMER trong database!"));

        // 6. Tạo User
        User user = new User();
        user.setFullName(request.fullName().trim());
        user.setEmail(email);
        user.setPhone(phone);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setUserStatus(UserStatus.ACTIVE);
        user.getRoles().add(customerRole);

        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getUserId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getRoles().stream()
                        .map(Role::getRoleCode).sorted().toList(),
                savedUser.getUserStatus().name()
        );
    }

    // ─── ĐĂNG NHẬP ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {

        String email = request.email().trim().toLowerCase(Locale.ROOT);
        log.info("Yêu cầu đăng nhập cho email: [{}]", email);

        // 1. Tìm tài khoản theo email
        User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
        if (user == null) {
            log.warn("Đăng nhập thất bại: Không tìm thấy tài khoản với email [{}]", email);
            throw new IllegalArgumentException("Email hoặc mật khẩu không đúng!");
        }

        // 2. Xác thực mật khẩu BCrypt
        boolean matches = passwordEncoder.matches(request.password(), user.getPasswordHash());
        if (!matches) {
            log.warn("Đăng nhập thất bại: Mật khẩu không khớp cho email [{}]", email);
            throw new IllegalArgumentException("Email hoặc mật khẩu không đúng!");
        }

        // 3. Kiểm tra trạng thái tài khoản
        if (user.getUserStatus() == UserStatus.LOCKED) {
            log.warn("Đăng nhập thất bại: Tài khoản [{}] đã bị khóa", email);
            throw new IllegalArgumentException("Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.");
        }

        List<String> roles = user.getRoles().stream()
                .map(Role::getRoleCode)
                .sorted()
                .toList();

        // 4. Sinh JWT token
        String token = jwtUtil.generateToken(email, roles);
        log.info("Đăng nhập thành công cho email: [{}] với roles: {}", email, roles);

        return LoginResponse.of(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                roles,
                user.getUserStatus().name(),
                token
        );
    }
}
