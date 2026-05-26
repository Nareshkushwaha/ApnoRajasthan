package com.aapno.aapnorajasthan.controller;

import com.aapno.aapnorajasthan.entity.SiteSettings;
import com.aapno.aapnorajasthan.repository.SiteSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@CrossOrigin(origins = "http://localhost:8081") 
@RestController
@RequestMapping("/api/settings")
public class SiteSettingsController {

    @Autowired
    private SiteSettingsRepository siteSettingsRepository;

    // Current settings lana
    @GetMapping("/current")
    public SiteSettings getCurrentSettings() {
        return siteSettingsRepository.findById(1L).orElseGet(() -> {
            SiteSettings defaultSettings = new SiteSettings();
            return siteSettingsRepository.save(defaultSettings);
        });
    }

    // Saari text/boolean settings save karna
    @PostMapping("/update")
    public SiteSettings updateSettings(@RequestBody SiteSettings settings) {
        settings.setId(1L); // Hamesha ID 1 hi rahegi
        return siteSettingsRepository.save(settings);
    }

    // Logo upload karne ke liye alag se API
    @PostMapping("/upload-logo")
    public String uploadLogo(@RequestParam("image") MultipartFile file) {
        try {
            String uploadDir = "uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String fileName = "logo_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "http://localhost:8085/uploads/" + fileName;
        } catch (IOException e) {
            return "";
        }
    }
}