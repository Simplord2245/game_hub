# GameHub Backend — Full REST API

Backend REST API hoàn chỉnh cho GameHub (website kinh doanh game và sản phẩm game), phát triển bằng **Java 21**, **Spring Boot 4.2.0**, **Spring Data JPA**, **Spring Security (JWT)** và **MySQL 8**.

---

## 🚀 Các chức năng đã triển khai đầy đủ

### 1. 🔐 Xác thực & Phân quyền (Auth & Security)
- Đăng ký tài khoản khách hàng (`POST /api/auth/register`), mã hóa mật khẩu bằng BCrypt (strength 12), gán mặc định role `CUSTOMER`.
- Đăng nhập (`POST /api/auth/login`), cấp JWT Bearer Token (JJWT 0.12.6) có thời hạn 24 giờ.
- Bộ lọc `JwtAuthFilter` tự động trích xuất và xác thực token trên mỗi request riêng tư.
- Phân quyền chi tiết theo vai trò (`ROLE_CUSTOMER`, `ROLE_STAFF`, `ROLE_ADMIN`) bằng `@EnableMethodSecurity`.

### 2. 🎮 Tra cứu Catalog Công khai (Public Catalog)
- API kiểm tra trạng thái (`GET /api/health`).
- Danh sách game có phân trang, tìm kiếm theo tên (`GET /api/games`).
- Chi tiết game theo ID (`GET /api/games/{id}`) hoặc theo slug (`GET /api/games/slug/{slug}`).
- Danh mục sản phẩm active (`GET /api/categories`).
- Danh sách sản phẩm active, lọc theo game, danh mục, từ khóa và sắp xếp (`GET /api/products`).
- Chi tiết sản phẩm theo ID hoặc slug (`GET /api/products/{id}`, `GET /api/products/slug/{slug}`).
- Xem số lượng tồn kho công khai của sản phẩm (`GET /api/products/{productId}/stock`).
- Xem đánh giá công khai của sản phẩm (`GET /api/products/{productId}/reviews`).

### 3. 👤 Quản lý Hồ sơ Cá nhân (User Profile)
- Xem thông tin tài khoản hiện tại (`GET /api/users/me`).
- Cập nhật thông tin cá nhân (họ tên, số điện thoại, avatar) (`PUT /api/users/me`).
- Đổi mật khẩu có kiểm tra mật khẩu cũ và xác nhận mật khẩu (`PATCH /api/users/me/password`).

### 4. 🛒 Giỏ hàng (Shopping Cart)
- Xem giỏ hàng cá nhân (`GET /api/cart`).
- Thêm sản phẩm vào giỏ hàng (`POST /api/cart/items`).
- Cập nhật số lượng sản phẩm trong giỏ (`PUT /api/cart/items/{cartItemId}`).
- Xóa sản phẩm khỏi giỏ (`DELETE /api/cart/items/{cartItemId}`).
- Làm trống toàn bộ giỏ hàng (`DELETE /api/cart`).

### 5. ❤️ Danh sách Yêu thích (Favorites)
- Xem danh sách sản phẩm yêu thích có phân trang (`GET /api/favorites`).
- Thêm sản phẩm vào danh sách yêu thích (`POST /api/favorites/{productId}`).
- Bỏ yêu thích sản phẩm (`DELETE /api/favorites/{productId}`).
- Kiểm tra trạng thái yêu thích (`GET /api/favorites/{productId}/check`).

### 6. 🎟️ Mã giảm giá (Coupons)
- Kiểm tra tính hợp lệ và áp dụng mã giảm giá (`POST /api/coupons/validate`) theo các điều kiện: hạn sử dụng, giá trị đơn tối thiểu, giới hạn tổng lượt và giới hạn lượt dùng mỗi khách hàng.

### 7. 📦 Đặt hàng & Đơn hàng (Orders)
- Tạo đơn hàng từ giỏ hàng hiện tại (`POST /api/orders`) kèm mã giảm giá tùy chọn, tự động snapshot thông tin giá/tên sản phẩm, tính toán giảm giá, giữ chỗ tồn kho (reservation) trong 24 giờ và làm trống giỏ hàng.
- Xem danh sách đơn hàng của tôi (`GET /api/orders`).
- Xem chi tiết đơn hàng theo mã đơn (`GET /api/orders/{orderCode}`), tự động kèm mã kích hoạt/tài khoản số khi đơn đã hoàn thành (`COMPLETED`).
- Khách hàng tự hủy đơn đang chờ thanh toán (`DELETE /api/orders/{orderId}/cancel`), tự động hoàn lại tồn kho khả dụng.

### 8. ⭐ Đánh giá sản phẩm (Reviews)
- Khách hàng đánh giá sản phẩm (1-5 sao kèm nhận xét) dựa trên từng dòng đơn hàng (`POST /api/reviews`).
- Chống đánh giá trùng lặp trên cùng một dòng đơn.

### 9. 📦 Quản lý Kho sản phẩm số (Digital Inventory)
- Staff/Admin nhập kho đơn vị số (tài khoản game, mã kích hoạt key/code) (`POST /api/admin/inventory`), dữ liệu bí mật được mã hóa an toàn.
- Xem danh sách tồn kho theo từng sản phẩm (`GET /api/admin/inventory/{productId}`).
- Tự động chuyển đổi trạng thái: `AVAILABLE` -> `RESERVED` (khi tạo đơn) -> `SOLD` (khi thanh toán/hoàn thành) hoặc trả lại `AVAILABLE` (khi đơn bị hủy).

### 10. 🎧 Hỗ trợ khách hàng (Support Tickets)
- Khách hàng tạo ticket hỗ trợ (`POST /api/tickets`), xem danh sách ticket (`GET /api/tickets`), xem chi tiết tin nhắn (`GET /api/tickets/{id}`).
- Khách hàng gửi tin nhắn phản hồi (`POST /api/tickets/{id}/reply`), tự động mở lại ticket nếu đang đóng.
- Staff/Admin xem danh sách ticket (`GET /api/admin/tickets`), phân công nhân viên (`PATCH /api/admin/tickets/{id}/assign`), đổi trạng thái (`PATCH /api/admin/tickets/{id}/status`), gửi phản hồi hoặc ghi chú nội bộ (`POST /api/admin/tickets/{id}/reply`).

### 11. 🛡️ Quản trị viên (Admin Management)
- **Quản lý Game:** CRUD danh mục game (`GET`, `POST`, `PUT`, `DELETE` `/api/admin/games`).
- **Quản lý Danh mục:** CRUD loại sản phẩm (`GET`, `POST`, `PUT`, `DELETE` `/api/admin/categories`).
- **Quản lý Sản phẩm:** CRUD sản phẩm, cập nhật trạng thái `DRAFT`/`ACTIVE`/`HIDDEN` (`GET`, `POST`, `PUT`, `PATCH /status` `/api/admin/products`).
- **Quản lý Đơn hàng:** Xem tất cả đơn hàng theo trạng thái, cập nhật trạng thái đơn (`GET`, `PATCH /status` `/api/admin/orders`).
- **Quản lý Người dùng:** Tra cứu, khóa/mở khóa tài khoản, phân quyền vai trò (`GET`, `PATCH /status`, `PUT /roles` `/api/admin/users`).

---

## 1. Yêu cầu môi trường

- **JDK 21** (hoặc tương thích Java 17+).
- **Maven 3.8+**.
- **MySQL 8.0.16+**.

Kiểm tra:
```powershell
java -version
mvn -version
```

---

## 2. Tạo Cơ sở dữ liệu

1. Mở MySQL Workbench / phpMyAdmin / DBeaver và kết nối MySQL local.
2. Thực thi file `database/gamehub_mysql.sql` để tạo database `gamehub` và 21 bảng.
3. Thực thi file `database/sample-data.sql` để thêm dữ liệu mẫu.

---

## 3. Cấu hình

Mở `src/main/resources/application.yml`. Cổng mặc định là **8088**.

Có thể ghi đè qua biến môi trường trong PowerShell:
```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
$env:JWT_SECRET="your_custom_jwt_secret_key_at_least_32_characters"
$env:SERVER_PORT="8088"
```

---

## 4. Chạy ứng dụng

### Bằng IntelliJ IDEA / Eclipse:
1. Mở IDE -> Open project tại thư mục `gamehub-backend`.
2. Chờ Maven tải xong dependencies.
3. Chạy file `src/main/java/com/gamehub/GameHubApplication.java`.

### Bằng Terminal:
```powershell
cd gamehub-backend
mvn spring-boot:run
```

Ứng dụng khởi động tại: `http://localhost:8088`.

---

## 5. Bảng tổng hợp API

| Nhóm | Method | Endpoint | Quyền |
|---|---|---|---|
| **Health** | GET | `/api/health` | Public |
| **Auth** | POST | `/api/auth/register` | Public |
| **Auth** | POST | `/api/auth/login` | Public |
| **User** | GET | `/api/users/me` | Customer / Staff / Admin |
| **User** | PUT | `/api/users/me` | Customer / Staff / Admin |
| **User** | PATCH | `/api/users/me/password` | Customer / Staff / Admin |
| **Games** | GET | `/api/games` | Public |
| **Games** | GET | `/api/games/{id}` | Public |
| **Games** | GET | `/api/games/slug/{slug}` | Public |
| **Categories** | GET | `/api/categories` | Public |
| **Products** | GET | `/api/products` | Public |
| **Products** | GET | `/api/products/{id}` | Public |
| **Products** | GET | `/api/products/slug/{slug}` | Public |
| **Products** | GET | `/api/products/{id}/stock` | Public |
| **Reviews** | GET | `/api/products/{id}/reviews` | Public |
| **Reviews** | POST | `/api/reviews` | Customer |
| **Cart** | GET | `/api/cart` | Customer |
| **Cart** | POST | `/api/cart/items` | Customer |
| **Cart** | PUT | `/api/cart/items/{id}` | Customer |
| **Cart** | DELETE | `/api/cart/items/{id}` | Customer |
| **Cart** | DELETE | `/api/cart` | Customer |
| **Favorites** | GET | `/api/favorites` | Customer |
| **Favorites** | POST | `/api/favorites/{productId}` | Customer |
| **Favorites** | DELETE | `/api/favorites/{productId}` | Customer |
| **Favorites** | GET | `/api/favorites/{productId}/check` | Customer |
| **Coupons** | POST | `/api/coupons/validate` | Customer |
| **Orders** | POST | `/api/orders` | Customer |
| **Orders** | GET | `/api/orders` | Customer |
| **Orders** | GET | `/api/orders/{code}` | Customer |
| **Orders** | DELETE | `/api/orders/{id}/cancel` | Customer |
| **Tickets** | POST | `/api/tickets` | Customer |
| **Tickets** | GET | `/api/tickets` | Customer |
| **Tickets** | GET | `/api/tickets/{id}` | Customer |
| **Tickets** | POST | `/api/tickets/{id}/reply` | Customer |
| **Admin Games** | GET, POST, PUT, DELETE | `/api/admin/games[/{id}]` | ADMIN |
| **Admin Categories** | GET, POST, PUT, DELETE | `/api/admin/categories[/{id}]` | ADMIN |
| **Admin Products** | GET, POST, PUT | `/api/admin/products[/{id}]` | ADMIN, STAFF |
| **Admin Products** | PATCH | `/api/admin/products/{id}/status` | ADMIN, STAFF |
| **Admin Inventory**| POST | `/api/admin/inventory` | ADMIN, STAFF |
| **Admin Inventory**| GET | `/api/admin/inventory/{productId}` | ADMIN, STAFF |
| **Admin Orders** | GET | `/api/admin/orders` | ADMIN, STAFF |
| **Admin Orders** | PATCH | `/api/admin/orders/{id}/status` | ADMIN, STAFF |
| **Admin Tickets**| GET | `/api/admin/tickets` | ADMIN, STAFF |
| **Admin Tickets**| GET | `/api/admin/tickets/{id}` | ADMIN, STAFF |
| **Admin Tickets**| PATCH | `/api/admin/tickets/{id}/status` | ADMIN, STAFF |
| **Admin Tickets**| PATCH | `/api/admin/tickets/{id}/assign` | ADMIN, STAFF |
| **Admin Tickets**| POST | `/api/admin/tickets/{id}/reply` | ADMIN, STAFF |
| **Admin Users** | GET | `/api/admin/users` | ADMIN |
| **Admin Users** | GET | `/api/admin/users/{id}` | ADMIN |
| **Admin Users** | PATCH | `/api/admin/users/{id}/status` | ADMIN |
| **Admin Users** | PUT | `/api/admin/users/{id}/roles` | ADMIN |

