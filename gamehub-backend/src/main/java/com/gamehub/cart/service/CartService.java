package com.gamehub.cart.service;

import com.gamehub.cart.dto.CartItemRequest;
import com.gamehub.cart.dto.CartResponse;
import com.gamehub.cart.entity.Cart;
import com.gamehub.cart.entity.CartItem;
import com.gamehub.cart.repository.CartItemRepository;
import com.gamehub.cart.repository.CartRepository;
import com.gamehub.common.exception.ResourceNotFoundException;
import com.gamehub.product.entity.Product;
import com.gamehub.product.repository.ProductRepository;
import com.gamehub.user.entity.User;
import com.gamehub.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Cart getOrCreateCart(String email) {
        return cartRepository.findByUser_EmailIgnoreCase(email)
                .orElseGet(() -> {
                    User user = userRepository.findByEmailIgnoreCase(email)
                            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng."));
                    Cart newCart = new Cart(user);
                    return cartRepository.save(newCart);
                });
    }

    @Transactional(readOnly = true)
    public CartResponse getCartResponse(String email) {
        Cart cart = getOrCreateCart(email);
        return CartResponse.from(cart);
    }

    @Transactional
    public CartResponse addItem(String email, CartItemRequest request) {
        Cart cart = getOrCreateCart(email);

        Product product = productRepository.findActiveProductById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm hoặc sản phẩm đã ngừng bán."));

        CartItem item = cartItemRepository.findByCart_CartIdAndProduct_ProductId(cart.getCartId(), product.getProductId())
                .orElse(null);

        if (item != null) {
            int newQty = Math.min(item.getQuantity() + request.quantity(), 99);
            item.setQuantity(newQty);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(cart, product, request.quantity());
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return CartResponse.from(cart);
    }

    @Transactional
    public CartResponse updateItem(String email, Long cartItemId, int quantity) {
        Cart cart = getOrCreateCart(email);

        CartItem item = cartItemRepository.findByCartItemIdAndCart_CartId(cartItemId, cart.getCartId())
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không có trong giỏ hàng."));

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(Math.min(quantity, 99));
            cartItemRepository.save(item);
        }

        return CartResponse.from(cart);
    }

    @Transactional
    public CartResponse removeItem(String email, Long cartItemId) {
        Cart cart = getOrCreateCart(email);

        CartItem item = cartItemRepository.findByCartItemIdAndCart_CartId(cartItemId, cart.getCartId())
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không có trong giỏ hàng."));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return CartResponse.from(cart);
    }

    @Transactional
    public void clearCart(String email) {
        Cart cart = getOrCreateCart(email);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
