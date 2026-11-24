
package com.gamehub.common.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.gamehub.common.api.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ── 400 BAD REQUEST ─────────────────────────────────────────────────────────

    /** Lỗi validation (@Valid) */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(
            MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Dữ liệu đầu vào không hợp lệ");

        return ResponseEntity
                .ok(ApiResponse.error(message));
    }

    /** Lỗi nghiệp vụ: email trùng, mật khẩu sai, ... */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(
            IllegalArgumentException ex) {

        return ResponseEntity
                .ok(ApiResponse.error(ex.getMessage()));
    }

    /** Mật khẩu sai từ Spring Security */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentials(
            BadCredentialsException ex) {

        return ResponseEntity
                .ok(ApiResponse.error("Email hoặc mật khẩu không đúng!"));
    }

    /** Tài khoản bị khóa */
    @ExceptionHandler(LockedException.class)
    public ResponseEntity<ApiResponse<Void>> handleLocked(LockedException ex) {
        return ResponseEntity
                .ok(ApiResponse.error("Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ."));
    }

    /** Tài khoản bị vô hiệu hóa */
    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ApiResponse<Void>> handleDisabled(DisabledException ex) {
        return ResponseEntity
                .ok(ApiResponse.error("Tài khoản chưa được kích hoạt."));
    }

    // ── 403 FORBIDDEN ───────────────────────────────────────────────────────────

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(
            AccessDeniedException ex) {

        return ResponseEntity
                .ok(ApiResponse.error("Bạn không có quyền thực hiện thao tác này."));
    }

    // ── NOT FOUND ────────────────────────────────────────────────────────────────

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(
            ResourceNotFoundException ex) {

        return ResponseEntity
                .ok(ApiResponse.error(ex.getMessage()));
    }

    // ── CONFLICT ─────────────────────────────────────────────────────────────────

    /** Lỗi trùng dữ liệu trong database (unique constraint) */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityException(
            DataIntegrityViolationException ex) {

        return ResponseEntity
                .ok(ApiResponse.error("Dữ liệu đã tồn tại hoặc vi phạm ràng buộc database"));
    }

    // ── GENERAL ERROR ─────────────────────────────────────────────────────────────

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {

        ex.printStackTrace();

        return ResponseEntity
                .ok(ApiResponse.error("Đã xảy ra lỗi: " + (ex.getMessage() != null ? ex.getMessage() : "Lỗi hệ thống")));
    }
}

