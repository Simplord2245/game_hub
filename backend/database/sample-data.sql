USE gamehub;

-- Du lieu demo chi de kiem tra API danh muc. Khong phai tai khoan game that.
INSERT INTO games (game_name, slug, publisher, description, cover_url, game_status)
VALUES
('Genshin Impact', 'genshin-impact', 'HoYoverse', 'Game hanh dong phieu luu the gioi mo.', 'https://placehold.co/600x800?text=Genshin+Impact', 'ACTIVE'),
('Zenless Zone Zero', 'zenless-zone-zero', 'HoYoverse', 'Game hanh dong nhap vai do thi.', 'https://placehold.co/600x800?text=Zenless+Zone+Zero', 'ACTIVE')
ON DUPLICATE KEY UPDATE game_name = VALUES(game_name), publisher = VALUES(publisher), game_status = VALUES(game_status);

INSERT INTO product_categories (category_name, slug, description, category_status)
VALUES
('Tai khoan game', 'tai-khoan-game', 'Tai khoan game ky thuat so.', 'ACTIVE'),
('Tai khoan reroll', 'tai-khoan-reroll', 'Tai khoan moi hoac tai khoan reroll.', 'ACTIVE'),
('Ma kich hoat', 'ma-kich-hoat', 'Ma kich hoat san pham game.', 'ACTIVE')
ON DUPLICATE KEY UPDATE category_name = VALUES(category_name), category_status = VALUES(category_status);

INSERT INTO products (
    game_id, category_id, sku, product_name, slug, product_type,
    platform, region, server_name, description, attributes,
    price, sale_price, product_status
)
SELECT g.game_id, c.category_id, 'GEN-DEMO-001',
       'Tai khoan Genshin Impact demo', 'genshin-account-demo', 'ACCOUNT',
       'PC', 'ASIA', 'Asia', 'San pham demo de kiem tra giao dien va API.',
       JSON_OBJECT('demo', true, 'note', 'Khong co thong tin dang nhap that'),
       250000.00, 220000.00, 'ACTIVE'
FROM games g CROSS JOIN product_categories c
WHERE g.slug = 'genshin-impact' AND c.slug = 'tai-khoan-game'
ON DUPLICATE KEY UPDATE product_name = VALUES(product_name), product_status = VALUES(product_status);

INSERT INTO products (
    game_id, category_id, sku, product_name, slug, product_type,
    platform, region, server_name, description, attributes,
    price, sale_price, product_status
)
SELECT g.game_id, c.category_id, 'ZZZ-DEMO-001',
       'Tai khoan Zenless Zone Zero demo', 'zzz-account-demo', 'ACCOUNT',
       'PC', 'ASIA', 'Asia', 'San pham demo de kiem tra loc theo game.',
       JSON_OBJECT('demo', true, 'note', 'Khong co thong tin dang nhap that'),
       180000.00, NULL, 'ACTIVE'
FROM games g CROSS JOIN product_categories c
WHERE g.slug = 'zenless-zone-zero' AND c.slug = 'tai-khoan-game'
ON DUPLICATE KEY UPDATE product_name = VALUES(product_name), product_status = VALUES(product_status);

-- ------------------------------------------------------------
-- Sample accounts (Password: matkhau123)
-- BCrypt hash for 'matkhau123' (cost 12):
-- $2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW
-- ------------------------------------------------------------
INSERT INTO users (user_id, full_name, email, password_hash, phone, user_status)
VALUES
(1, 'Administrator', 'admin@gamehub.com', '$2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW', '0900000001', 'ACTIVE'),
(2, 'Nhan vien ho tro', 'staff@gamehub.com', '$2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW', '0900000002', 'ACTIVE'),
(3, 'Nguyen Van A', 'nguyenvana@example.com', '$2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW', '0912345678', 'ACTIVE')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), password_hash = VALUES(password_hash);

-- Assign roles
INSERT INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id FROM users u CROSS JOIN roles r WHERE u.email = 'admin@gamehub.com' AND r.role_code = 'ADMIN'
ON DUPLICATE KEY UPDATE assigned_at = CURRENT_TIMESTAMP;

INSERT INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id FROM users u CROSS JOIN roles r WHERE u.email = 'staff@gamehub.com' AND r.role_code = 'STAFF'
ON DUPLICATE KEY UPDATE assigned_at = CURRENT_TIMESTAMP;

INSERT INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id FROM users u CROSS JOIN roles r WHERE u.email = 'nguyenvana@example.com' AND r.role_code = 'CUSTOMER'
ON DUPLICATE KEY UPDATE assigned_at = CURRENT_TIMESTAMP;
