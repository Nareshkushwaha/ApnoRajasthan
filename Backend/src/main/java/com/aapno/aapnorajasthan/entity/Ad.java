package com.aapno.aapnorajasthan.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "ads")
public class Ad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String position; // Header, Sidebar, Footer, Inline

    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl; // Asali photo ka link

    private String clickUrl; // Ad par click karne par kahan jana hai

    private String status = "Active"; // Active ya Inactive

    private int clicks = 0; // Kitne logo ne click kiya
    private int impressions = 0; // Kitne logo ne dekha

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Ad() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getClickUrl() { return clickUrl; }
    public void setClickUrl(String clickUrl) { this.clickUrl = clickUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getClicks() { return clicks; }
    public void setClicks(int clicks) { this.clicks = clicks; }

    public int getImpressions() { return impressions; }
    public void setImpressions(int impressions) { this.impressions = impressions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}