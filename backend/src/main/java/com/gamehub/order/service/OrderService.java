package com.gamehub.order.service;

import com.gamehub.cart.entity.Cart;
import com.gamehub.cart.entity.CartItem;
import com.gamehub.cart.service.CartService;
import com.gamehub.common.api.PageResponse;
import com.gamehub.common.exception.ResourceNotFoundException;
import com.gamehub.coupon.dto.CouponValidateRequest;
import com.gamehub.coupon.dto.CouponValidateResponse;
import com.gamehub.coupon.entity.Coupon;
import com.gamehub.coupon.repository.CouponRepository;
import com.gamehub.coupon.service.CouponService;
import com.gamehub.inventory.service.InventoryService;
import com.gamehub.order.dto.OrderItemResponse;
import com.gamehub.order.dto.OrderResponse;
import com.gamehub.order.dto.PlaceOrderRequest;
import com.gamehub.order.entity.Order;
import com.gamehub.order.entity.OrderItem;
import com.gamehub.order.repository.OrderItemRepository;
import com.gamehub.order.repository.OrderRepository;
import com.gamehub.product.entity.Product;
import com.gamehub.user.entity.User;
import com.gamehub.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartService cartService;
    private final InventoryService inventoryService;
    private final CouponService couponService;
    private final CouponRepository couponRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        CartService cartService,
                        InventoryService inventoryService,
                        CouponService couponService,
                        CouponRepository couponRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartService = cartService;
        this.inventoryService = inventoryService;
        this.couponService = couponService;
        this.couponRepository = couponRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponse placeOrder(String email, PlaceOrderRequest request) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng."));

        Cart cart = cartService.getOrCreateCart(email);
        if (cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Giỏ hàng của bạn đang trống!");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        // Kiểm tra từng sản phẩm
        for (CartItem ci : cart.getItems()) {
            Product p = ci.getProduct();
            if (!"ACTIVE".equals(p.getProductStatus())) {
                throw new IllegalArgumentException("Sản phẩm '" + p.getProductName() + "' hiện không còn bán.");
            }

            BigDecimal unitPrice = (p.getSalePrice() != null && p.getSalePrice().compareTo(BigDecimal.ZERO) > 0)
                    ? p.getSalePrice()
                    : p.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(ci.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            OrderItem oi = new OrderItem();
            oi.setProduct(p);
            oi.setSkuSnapshot(p.getSku());
            oi.setNameSnapshot(p.getProductName());
            oi.setUnitPrice(unitPrice);
            oi.setQuantity(ci.getQuantity());
            oi.setLineTotal(lineTotal);
            oi.setDeliveryStatus("WAITING");
            orderItems.add(oi);
        }

        // Xử lý coupon
        BigDecimal discountTotal = BigDecimal.ZERO;
        Coupon usedCoupon = null;
        if (request.couponCode() != null && !request.couponCode().isBlank()) {
            CouponValidateResponse cvr = couponService.validateCoupon(
                    email, new CouponValidateRequest(request.couponCode().trim(), subtotal));
            discountTotal = cvr.discountAmount();
            usedCoupon = couponRepository.findByCouponCodeIgnoreCase(request.couponCode().trim()).orElse(null);
        }

        BigDecimal totalAmount = subtotal.subtract(discountTotal);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }

        // Tạo Order
        Order order = new Order();
        order.setUser(user);
        order.setOrderCode("GH-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setOrderStatus("PENDING_PAYMENT");
        order.setSubtotal(subtotal);
        order.setDiscountTotal(discountTotal);
        order.setTotalAmount(totalAmount);
        order.setCustomerNote(request.customerNote());
        LocalDateTime deadline = LocalDateTime.now().plusHours(24);
        order.setPaymentDeadline(deadline);

        for (OrderItem oi : orderItems) {
            oi.setOrder(order);
        }
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Giữ chỗ trong kho
        for (OrderItem oi : savedOrder.getItems()) {
            inventoryService.reserveItems(oi.getProduct().getProductId(), oi.getQuantity(), oi.getOrderItemId(), deadline);
        }

        // Ghi nhận coupon nếu có
        if (usedCoupon != null && discountTotal.compareTo(BigDecimal.ZERO) > 0) {
            couponService.recordRedemption(usedCoupon, user, savedOrder.getOrderId(), discountTotal);
        }

        // Làm trống giỏ hàng
        cartService.clearCart(email);

        return mapToResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getMyOrders(String email, int page, int size) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng."));

        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.findByUser_UserId(user.getUserId(), pageable);

        return PageResponse.from(orders.map(this::mapToResponse));
    }

    @Transactional(readOnly = true)
    public OrderResponse getMyOrderByCode(String email, String orderCode) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng."));

        Order order = orderRepository.findByOrderCodeAndUser_UserId(orderCode, user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng."));

        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(String email, Long orderId) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng."));

        Order order = orderRepository.findByOrderIdAndUser_UserId(orderId, user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng."));

        if (!"PENDING_PAYMENT".equals(order.getOrderStatus())) {
            throw new IllegalArgumentException("Chỉ có thể hủy đơn hàng đang chờ thanh toán.");
        }

        order.setOrderStatus("CANCELLED");
        orderRepository.save(order);

        // Giải phóng tồn kho đã giữ chỗ
        for (OrderItem oi : order.getItems()) {
            inventoryService.releaseReservation(oi.getOrderItemId());
        }

        return mapToResponse(order);
    }

    // Admin / Staff methods
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getAllOrders(String status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.findAllByStatus(status, pageable);
        return PageResponse.from(orders.map(this::mapToResponse));
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng."));

        order.setOrderStatus(newStatus);

        // Nếu chuyển sang COMPLETED: bàn giao hàng (chuyển inventory sang SOLD, orderItem sang DELIVERED)
        if ("COMPLETED".equalsIgnoreCase(newStatus)) {
            for (OrderItem oi : order.getItems()) {
                inventoryService.markAsSold(oi.getOrderItemId());
                oi.setDeliveryStatus("DELIVERED");
                oi.setDeliveredAt(LocalDateTime.now());
                orderItemRepository.save(oi);
            }
        } else if ("CANCELLED".equalsIgnoreCase(newStatus)) {
            for (OrderItem oi : order.getItems()) {
                inventoryService.releaseReservation(oi.getOrderItemId());
            }
        }

        Order saved = orderRepository.save(order);
        return mapToResponse(saved);
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream().map(oi -> {
            List<String> secrets = null;
            if ("DELIVERED".equals(oi.getDeliveryStatus()) || "COMPLETED".equals(order.getOrderStatus())) {
                secrets = inventoryService.getDeliveredSecrets(oi.getOrderItemId());
            }
            return OrderItemResponse.from(oi, secrets);
        }).toList();

        return OrderResponse.from(order, itemResponses);
    }
}
