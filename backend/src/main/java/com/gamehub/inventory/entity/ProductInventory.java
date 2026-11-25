package com.gamehub.inventory.entity;

import com.gamehub.product.entity.Product;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_inventory")
public class ProductInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Long inventoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "inventory_code", unique = true, length = 80)
    private String inventoryCode;

    @Column(name = "secret_payload_encrypted", nullable = false, columnDefinition = "LONGTEXT")
    private String secretPayloadEncrypted;

    @Column(name = "display_note", length = 500)
    private String displayNote;

    @Column(name = "inventory_status", nullable = false)
    private String inventoryStatus = "AVAILABLE"; // 'AVAILABLE','RESERVED','SOLD','DISABLED'

    @Column(name = "order_item_id")
    private Long orderItemId;

    @Column(name = "reserved_until")
    private LocalDateTime reservedUntil;

    @Column(name = "sold_at")
    private LocalDateTime soldAt;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public ProductInventory() { }

    public ProductInventory(Product product, String inventoryCode, String secretPayloadEncrypted, String displayNote) {
        this.product = product;
        this.inventoryCode = inventoryCode;
        this.secretPayloadEncrypted = secretPayloadEncrypted;
        this.displayNote = displayNote;
        this.inventoryStatus = "AVAILABLE";
    }

    public Long getInventoryId() { return inventoryId; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public String getInventoryCode() { return inventoryCode; }
    public void setInventoryCode(String inventoryCode) { this.inventoryCode = inventoryCode; }
    public String getSecretPayloadEncrypted() { return secretPayloadEncrypted; }
    public void setSecretPayloadEncrypted(String secretPayloadEncrypted) { this.secretPayloadEncrypted = secretPayloadEncrypted; }
    public String getDisplayNote() { return displayNote; }
    public void setDisplayNote(String displayNote) { this.displayNote = displayNote; }
    public String getInventoryStatus() { return inventoryStatus; }
    public void setInventoryStatus(String inventoryStatus) { this.inventoryStatus = inventoryStatus; }
    public Long getOrderItemId() { return orderItemId; }
    public void setOrderItemId(Long orderItemId) { this.orderItemId = orderItemId; }
    public LocalDateTime getReservedUntil() { return reservedUntil; }
    public void setReservedUntil(LocalDateTime reservedUntil) { this.reservedUntil = reservedUntil; }
    public LocalDateTime getSoldAt() { return soldAt; }
    public void setSoldAt(LocalDateTime soldAt) { this.soldAt = soldAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
