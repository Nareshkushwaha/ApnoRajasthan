package com.aapno.aapnorajasthan.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "static_pages")
public class StaticPage {

    @Id
    private Long id = 1L; // Hamesha 1 rahega

    // 👉 LONGTEXT zaroori hai kyunki terms and conditions bahut lambe hote hain
    @Column(columnDefinition = "LONGTEXT")
    private String aboutContent = "APNO RAJASTHAN राजस्थान का अग्रणी हिंदी न्यूज़ पोर्टल है...";

    @Column(columnDefinition = "LONGTEXT")
    private String privacyContent = "गोपनीयता नीति: हम आपकी निजी जानकारी की सुरक्षा...";

    @Column(columnDefinition = "LONGTEXT")
    private String termsContent = "उपयोग की शर्तें: इस वेबसाइट का उपयोग करके...";

    public StaticPage() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAboutContent() { return aboutContent; }
    public void setAboutContent(String aboutContent) { this.aboutContent = aboutContent; }

    public String getPrivacyContent() { return privacyContent; }
    public void setPrivacyContent(String privacyContent) { this.privacyContent = privacyContent; }

    public String getTermsContent() { return termsContent; }
    public void setTermsContent(String termsContent) { this.termsContent = termsContent; }
}