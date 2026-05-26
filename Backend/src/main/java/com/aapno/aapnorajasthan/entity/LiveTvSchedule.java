package com.aapno.aapnorajasthan.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class LiveTvSchedule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String time; // जैसे: "09:00 AM"
    private String showName; // शो का नाम
    private String description;

    // Getters and Setters (Lombok हटाने के बाद ये लगाना ज़रूरी है)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getShowName() { return showName; }
    public void setShowName(String showName) { this.showName = showName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}