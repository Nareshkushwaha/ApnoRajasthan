package com.aapno.aapnorajasthan.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "site_settings")
public class SiteSettings {

    @Id
    private Long id = 1L; // Hamesha 1 rahega kyunki ek hi setting file hogi

    // General
    private String siteName = "APNO RAJASTHAN";
    private String tagline = "राजस्थान की आवाज़";
    private String logoUrl = "";
    private String contactEmail = "contact@apnorajasthan.com";

    // Theme
    private String primaryColor = "#dc2626";
    private String accentColor = "#f59e0b";
    private boolean darkModeDefault = false;

    // Social
    private String facebook = "";
    private String twitter = "";
    private String youtube = "";
    private String instagram = "";

    // Language
    private boolean langHindi = true;
    private boolean langEnglish = false;
    private boolean langRajasthani = false;

    public SiteSettings() {}

    // Getters and Setters (Sabhi fields ke liye)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSiteName() { return siteName; }
    public void setSiteName(String siteName) { this.siteName = siteName; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getPrimaryColor() { return primaryColor; }
    public void setPrimaryColor(String primaryColor) { this.primaryColor = primaryColor; }

    public String getAccentColor() { return accentColor; }
    public void setAccentColor(String accentColor) { this.accentColor = accentColor; }

    public boolean isDarkModeDefault() { return darkModeDefault; }
    public void setDarkModeDefault(boolean darkModeDefault) { this.darkModeDefault = darkModeDefault; }

    public String getFacebook() { return facebook; }
    public void setFacebook(String facebook) { this.facebook = facebook; }

    public String getTwitter() { return twitter; }
    public void setTwitter(String twitter) { this.twitter = twitter; }

    public String getYoutube() { return youtube; }
    public void setYoutube(String youtube) { this.youtube = youtube; }

    public String getInstagram() { return instagram; }
    public void setInstagram(String instagram) { this.instagram = instagram; }

    public boolean isLangHindi() { return langHindi; }
    public void setLangHindi(boolean langHindi) { this.langHindi = langHindi; }

    public boolean isLangEnglish() { return langEnglish; }
    public void setLangEnglish(boolean langEnglish) { this.langEnglish = langEnglish; }

    public boolean isLangRajasthani() { return langRajasthani; }
    public void setLangRajasthani(boolean langRajasthani) { this.langRajasthani = langRajasthani; }
}