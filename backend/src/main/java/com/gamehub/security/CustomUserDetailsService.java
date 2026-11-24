package com.gamehub.security;

import com.gamehub.user.entity.Role;
import com.gamehub.user.entity.User;
import com.gamehub.user.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Triển khai UserDetailsService để Spring Security nạp thông tin người dùng
 * từ database khi xác thực JWT hoặc form login.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Không tìm thấy tài khoản: " + email));

        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(Role::getRoleCode)
                .map(code -> new SimpleGrantedAuthority("ROLE_" + code))
                .toList();

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                // enabled, accountNonExpired, credentialsNonExpired, accountNonLocked
                user.getUserStatus().name().equals("ACTIVE"),
                true,
                true,
                !user.getUserStatus().name().equals("LOCKED"),
                authorities
        );
    }
}
