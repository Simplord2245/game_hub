-- ============================================================
-- GAMEHUB - MySQL database schema
-- Requires MySQL 8.0.16+ (CHECK constraints are enforced)
-- Charset: utf8mb4
-- ============================================================

CREATE DATABASE IF NOT EXISTS gamehub
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE gamehub;

-- 1. Roles and users
CREATE TABLE roles (
  role_id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_code     VARCHAR(30) NOT NULL UNIQUE,
  role_name     VARCHAR(80) NOT NULL,
  description   VARCHAR(255) NULL
) ENGINE=InnoDB;

CREATE TABLE users (
  user_id       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(120) NOT NULL,
  email         VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL COMMENT 'Store BCrypt/Argon2 hash; never store plaintext passwords',
  phone         VARCHAR(25) NULL UNIQUE,
  avatar_url    VARCHAR(500) NULL,
  user_status   ENUM('ACTIVE','LOCKED','PENDING_VERIFICATION') NOT NULL DEFAULT 'ACTIVE',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_status (user_status)
) ENGINE=InnoDB;

CREATE TABLE user_roles (
  user_id BIGINT UNSIGNED NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(role_id)
) ENGINE=InnoDB;

-- 2. Games, product categories and products
CREATE TABLE games (
  game_id       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  game_name     VARCHAR(160) NOT NULL,
  slug          VARCHAR(180) NOT NULL UNIQUE,
  publisher     VARCHAR(160) NULL,
  description   TEXT NULL,
  cover_url     VARCHAR(500) NULL,
  game_status   ENUM('ACTIVE','HIDDEN') NOT NULL DEFAULT 'ACTIVE',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_games_status_name (game_status, game_name)
) ENGINE=InnoDB;

CREATE TABLE product_categories (
  category_id   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL,
  slug          VARCHAR(120) NOT NULL UNIQUE,
  description   VARCHAR(500) NULL,
  category_status ENUM('ACTIVE','HIDDEN') NOT NULL DEFAULT 'ACTIVE',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE products (
  product_id    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  game_id       BIGINT UNSIGNED NOT NULL,
  category_id   BIGINT UNSIGNED NOT NULL,
  sku           VARCHAR(50) NOT NULL UNIQUE,
  product_name  VARCHAR(200) NOT NULL,
  slug          VARCHAR(220) NOT NULL UNIQUE,
  product_type  ENUM('ACCOUNT','GAME_KEY','ITEM_CODE') NOT NULL,
  platform      VARCHAR(80) NULL,
  region        VARCHAR(80) NULL,
  server_name   VARCHAR(100) NULL,
  description   TEXT NULL,
  attributes    JSON NULL COMMENT 'Flexible non-secret attributes, e.g. rank, character count, gem amount',
  price         DECIMAL(12,2) NOT NULL,
  sale_price    DECIMAL(12,2) NULL,
  product_status ENUM('DRAFT','ACTIVE','HIDDEN') NOT NULL DEFAULT 'DRAFT',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_game FOREIGN KEY (game_id) REFERENCES games(game_id),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES product_categories(category_id),
  CONSTRAINT chk_products_price CHECK (price > 0),
  CONSTRAINT chk_products_sale_price CHECK (sale_price IS NULL OR (sale_price > 0 AND sale_price < price)),
  INDEX idx_products_game_status (game_id, product_status),
  INDEX idx_products_category_status (category_id, product_status),
  INDEX idx_products_type_status (product_type, product_status),
  INDEX idx_products_name (product_name)
) ENGINE=InnoDB;

CREATE TABLE product_images (
  image_id      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id    BIGINT UNSIGNED NOT NULL,
  image_url     VARCHAR(500) NOT NULL,
  is_primary    BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(product_id),
  INDEX idx_product_images_product_order (product_id, sort_order)
) ENGINE=InnoDB;

-- 3. Shopping cart
CREATE TABLE carts (
  cart_id       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL UNIQUE,
  cart_status   ENUM('ACTIVE','CONVERTED','ABANDONED') NOT NULL DEFAULT 'ACTIVE',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

CREATE TABLE cart_items (
  cart_item_id  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cart_id       BIGINT UNSIGNED NOT NULL,
  product_id    BIGINT UNSIGNED NOT NULL,
  quantity      INT UNSIGNED NOT NULL DEFAULT 1,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(cart_id),
  CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES products(product_id),
  CONSTRAINT uq_cart_product UNIQUE (cart_id, product_id),
  CONSTRAINT chk_cart_item_quantity CHECK (quantity > 0),
  INDEX idx_cart_items_product (product_id)
) ENGINE=InnoDB;

-- 4. Orders and order lines
CREATE TABLE orders (
  order_id       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_code     VARCHAR(40) NOT NULL UNIQUE,
  user_id        BIGINT UNSIGNED NOT NULL,
  order_status   ENUM('PENDING_PAYMENT','PAID','PROCESSING','COMPLETED','CANCELLED','REFUND_PENDING','REFUNDED') NOT NULL DEFAULT 'PENDING_PAYMENT',
  subtotal       DECIMAL(12,2) NOT NULL,
  discount_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_amount   DECIMAL(12,2) NOT NULL,
  customer_note  VARCHAR(500) NULL,
  payment_deadline DATETIME NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT chk_orders_amounts CHECK (subtotal >= 0 AND discount_total >= 0 AND total_amount >= 0),
  INDEX idx_orders_user_date (user_id, created_at),
  INDEX idx_orders_status_date (order_status, created_at)
) ENGINE=InnoDB;

CREATE TABLE order_items (
  order_item_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id      BIGINT UNSIGNED NOT NULL,
  product_id    BIGINT UNSIGNED NOT NULL,
  sku_snapshot  VARCHAR(50) NOT NULL,
  name_snapshot VARCHAR(200) NOT NULL,
  unit_price    DECIMAL(12,2) NOT NULL,
  quantity      INT UNSIGNED NOT NULL,
  line_total    DECIMAL(12,2) NOT NULL,
  delivery_status ENUM('WAITING','READY','DELIVERED','FAILED') NOT NULL DEFAULT 'WAITING',
  delivered_at  DATETIME NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(product_id),
  CONSTRAINT chk_order_items_values CHECK (unit_price >= 0 AND quantity > 0 AND line_total >= 0),
  INDEX idx_order_items_order (order_id),
  INDEX idx_order_items_product (product_id)
) ENGINE=InnoDB;

-- Each row represents one unique digital unit (one account, one key, or one code).
-- The secret payload must be encrypted by the backend before being stored here.
CREATE TABLE product_inventory (
  inventory_id  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id    BIGINT UNSIGNED NOT NULL,
  inventory_code VARCHAR(80) NULL UNIQUE,
  secret_payload_encrypted LONGTEXT NOT NULL,
  display_note  VARCHAR(500) NULL,
  inventory_status ENUM('AVAILABLE','RESERVED','SOLD','DISABLED') NOT NULL DEFAULT 'AVAILABLE',
  order_item_id BIGINT UNSIGNED NULL,
  reserved_until DATETIME NULL,
  sold_at       DATETIME NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES products(product_id),
  CONSTRAINT fk_inventory_order_item FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id),
  INDEX idx_inventory_product_status (product_id, inventory_status),
  INDEX idx_inventory_reservation (inventory_status, reserved_until),
  INDEX idx_inventory_order_item (order_item_id)
) ENGINE=InnoDB;

-- 5. Payment records
CREATE TABLE payments (
  payment_id    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL,
  order_id      BIGINT UNSIGNED NULL COMMENT 'NULL for wallet top-up transactions',
  payment_purpose ENUM('ORDER','WALLET_TOPUP') NOT NULL,
  payment_method ENUM('BANK_TRANSFER','VNPAY','MOMO','CARD','OTHER') NOT NULL,
  provider_name VARCHAR(80) NULL,
  provider_transaction_code VARCHAR(150) NULL UNIQUE,
  amount        DECIMAL(12,2) NOT NULL,
  payment_status ENUM('PENDING','PAID','FAILED','CANCELLED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  raw_response  JSON NULL COMMENT 'Store sanitized provider response; do not store card secrets',
  paid_at       DATETIME NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
  CONSTRAINT chk_payments_amount CHECK (amount > 0),
  CONSTRAINT chk_payments_purpose_order CHECK (
    (payment_purpose = 'ORDER' AND order_id IS NOT NULL) OR
    (payment_purpose = 'WALLET_TOPUP' AND order_id IS NULL)
  ),
  INDEX idx_payments_user_date (user_id, created_at),
  INDEX idx_payments_status_date (payment_status, created_at),
  INDEX idx_payments_order (order_id)
) ENGINE=InnoDB;

-- 6. Optional member wallet and its ledger
CREATE TABLE wallets (
  wallet_id     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL UNIQUE,
  balance       DECIMAL(12,2) NOT NULL DEFAULT 0,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_wallets_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT chk_wallet_balance CHECK (balance >= 0)
) ENGINE=InnoDB;

CREATE TABLE wallet_transactions (
  wallet_transaction_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  wallet_id     BIGINT UNSIGNED NOT NULL,
  payment_id    BIGINT UNSIGNED NULL,
  order_id      BIGINT UNSIGNED NULL,
  transaction_type ENUM('TOPUP','ORDER_PAYMENT','REFUND','ADJUSTMENT') NOT NULL,
  direction     ENUM('CREDIT','DEBIT') NOT NULL,
  amount        DECIMAL(12,2) NOT NULL,
  balance_after DECIMAL(12,2) NOT NULL,
  transaction_status ENUM('PENDING','SUCCESS','FAILED') NOT NULL DEFAULT 'SUCCESS',
  idempotency_key VARCHAR(100) NOT NULL UNIQUE,
  description   VARCHAR(500) NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_wallet_tx_wallet FOREIGN KEY (wallet_id) REFERENCES wallets(wallet_id),
  CONSTRAINT fk_wallet_tx_payment FOREIGN KEY (payment_id) REFERENCES payments(payment_id),
  CONSTRAINT fk_wallet_tx_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
  CONSTRAINT chk_wallet_tx_amount CHECK (amount > 0 AND balance_after >= 0),
  INDEX idx_wallet_tx_wallet_date (wallet_id, created_at),
  INDEX idx_wallet_tx_order (order_id)
) ENGINE=InnoDB;

-- 7. Coupons and redemptions
CREATE TABLE coupons (
  coupon_id     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  coupon_code   VARCHAR(40) NOT NULL UNIQUE,
  description   VARCHAR(255) NULL,
  discount_type ENUM('PERCENT','FIXED') NOT NULL,
  discount_value DECIMAL(12,2) NOT NULL,
  minimum_order_value DECIMAL(12,2) NOT NULL DEFAULT 0,
  maximum_discount DECIMAL(12,2) NULL,
  usage_limit   INT UNSIGNED NULL,
  per_user_limit INT UNSIGNED NOT NULL DEFAULT 1,
  starts_at     DATETIME NULL,
  expires_at    DATETIME NULL,
  coupon_status ENUM('ACTIVE','INACTIVE','EXPIRED') NOT NULL DEFAULT 'ACTIVE',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_coupon_discount CHECK (discount_value > 0),
  CONSTRAINT chk_coupon_minimum CHECK (minimum_order_value >= 0),
  INDEX idx_coupons_status_expiry (coupon_status, expires_at)
) ENGINE=InnoDB;

CREATE TABLE coupon_redemptions (
  redemption_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  coupon_id     BIGINT UNSIGNED NOT NULL,
  user_id       BIGINT UNSIGNED NOT NULL,
  order_id      BIGINT UNSIGNED NOT NULL UNIQUE,
  discount_amount DECIMAL(12,2) NOT NULL,
  redeemed_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_redemptions_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(coupon_id),
  CONSTRAINT fk_redemptions_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_redemptions_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
  CONSTRAINT chk_redemption_discount CHECK (discount_amount >= 0),
  INDEX idx_redemptions_coupon_user (coupon_id, user_id)
) ENGINE=InnoDB;

-- 8. Reviews and favorites
CREATE TABLE reviews (
  review_id     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id    BIGINT UNSIGNED NOT NULL,
  user_id       BIGINT UNSIGNED NOT NULL,
  order_item_id BIGINT UNSIGNED NOT NULL UNIQUE,
  rating        TINYINT UNSIGNED NOT NULL,
  comment       TEXT NULL,
  review_status ENUM('VISIBLE','HIDDEN') NOT NULL DEFAULT 'VISIBLE',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products(product_id),
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_reviews_order_item FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id),
  CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5),
  INDEX idx_reviews_product_status (product_id, review_status)
) ENGINE=InnoDB;

CREATE TABLE favorites (
  user_id       BIGINT UNSIGNED NOT NULL,
  product_id    BIGINT UNSIGNED NOT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, product_id),
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_favorites_product FOREIGN KEY (product_id) REFERENCES products(product_id)
) ENGINE=InnoDB;

-- 9. Customer support
CREATE TABLE support_tickets (
  ticket_id     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ticket_code   VARCHAR(40) NOT NULL UNIQUE,
  user_id       BIGINT UNSIGNED NOT NULL,
  order_id      BIGINT UNSIGNED NULL,
  assigned_staff_id BIGINT UNSIGNED NULL,
  subject       VARCHAR(200) NOT NULL,
  priority      ENUM('LOW','NORMAL','HIGH') NOT NULL DEFAULT 'NORMAL',
  ticket_status ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL DEFAULT 'OPEN',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tickets_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_tickets_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
  CONSTRAINT fk_tickets_staff FOREIGN KEY (assigned_staff_id) REFERENCES users(user_id),
  INDEX idx_tickets_status_date (ticket_status, created_at),
  INDEX idx_tickets_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE ticket_messages (
  message_id    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ticket_id     BIGINT UNSIGNED NOT NULL,
  sender_user_id BIGINT UNSIGNED NOT NULL,
  message_content TEXT NOT NULL,
  is_internal   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ticket_messages_ticket FOREIGN KEY (ticket_id) REFERENCES support_tickets(ticket_id),
  CONSTRAINT fk_ticket_messages_sender FOREIGN KEY (sender_user_id) REFERENCES users(user_id),
  INDEX idx_ticket_messages_ticket_date (ticket_id, created_at)
) ENGINE=InnoDB;

-- 10. Convenience view for product stock counts
CREATE OR REPLACE VIEW vw_product_stock AS
SELECT
  p.product_id,
  p.sku,
  p.product_name,
  p.product_status,
  COALESCE(SUM(CASE WHEN pi.inventory_status = 'AVAILABLE' THEN 1 ELSE 0 END), 0) AS available_stock,
  COALESCE(SUM(CASE WHEN pi.inventory_status = 'RESERVED' THEN 1 ELSE 0 END), 0) AS reserved_stock,
  COALESCE(SUM(CASE WHEN pi.inventory_status = 'SOLD' THEN 1 ELSE 0 END), 0) AS sold_stock
FROM products p
LEFT JOIN product_inventory pi ON pi.product_id = p.product_id
GROUP BY p.product_id, p.sku, p.product_name, p.product_status;

-- 11. Initial role data
INSERT INTO roles (role_code, role_name, description) VALUES
('ADMIN', 'Quản trị viên', 'Quản lý toàn bộ hệ thống'),
('STAFF', 'Nhân viên', 'Xử lý đơn hàng, kho và hỗ trợ khách hàng'),
('CUSTOMER', 'Khách hàng', 'Mua và sử dụng sản phẩm trên website')
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);
