package com.gamehub.config;

import com.gamehub.user.entity.Role;
import com.gamehub.user.entity.User;
import com.gamehub.user.entity.UserStatus;
import com.gamehub.user.repository.RoleRepository;
import com.gamehub.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Tự động kiểm tra và khởi tạo các role cùng tài khoản mặc định khi ứng dụng khởi động.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Đảm bảo 3 role tồn tại
        Role adminRole = roleRepository.findByRoleCode("ADMIN").orElseGet(() -> {
            Role r = new Role();
            r.setRoleCode("ADMIN");
            r.setRoleName("Quản trị viên");
            r.setDescription("Quản lý toàn bộ hệ thống");
            return roleRepository.save(r);
        });

        Role staffRole = roleRepository.findByRoleCode("STAFF").orElseGet(() -> {
            Role r = new Role();
            r.setRoleCode("STAFF");
            r.setRoleName("Nhân viên");
            r.setDescription("Xử lý đơn hàng, kho và hỗ trợ");
            return roleRepository.save(r);
        });

        Role customerRole = roleRepository.findByRoleCode("CUSTOMER").orElseGet(() -> {
            Role r = new Role();
            r.setRoleCode("CUSTOMER");
            r.setRoleName("Khách hàng");
            r.setDescription("Mua và sử dụng sản phẩm trên website");
            return roleRepository.save(r);
        });

        // 2. Luôn đồng bộ tài khoản mẫu nguyenvana@example.com (Đầy đủ quyền CUSTOMER, STAFF, ADMIN để test)
        User customer = userRepository.findByEmailIgnoreCase("nguyenvana@example.com")
                .orElseGet(() -> {
                    User u = new User();
                    u.setEmail("nguyenvana@example.com");
                    return u;
                });
        customer.setFullName("Nguyen Van A");
        customer.setPhone("0912345678");
        customer.setPasswordHash(passwordEncoder.encode("matkhau123"));
        customer.setUserStatus(UserStatus.ACTIVE);
        customer.getRoles().clear();
        customer.getRoles().add(customerRole);
        customer.getRoles().add(staffRole);
        customer.getRoles().add(adminRole);
        userRepository.save(customer);

        // 3. Luôn đồng bộ tài khoản mẫu admin@gamehub.com (matkhau123)
        User admin = userRepository.findByEmailIgnoreCase("admin@gamehub.com")
                .orElseGet(() -> {
                    User u = new User();
                    u.setEmail("admin@gamehub.com");
                    return u;
                });
        admin.setFullName("Administrator");
        admin.setPhone("0900000001");
        admin.setPasswordHash(passwordEncoder.encode("matkhau123"));
        admin.setUserStatus(UserStatus.ACTIVE);
        admin.getRoles().clear();
        admin.getRoles().add(adminRole);
        userRepository.save(admin);
    }
}
