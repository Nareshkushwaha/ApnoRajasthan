package com.aapno.aapnorajasthan.controller;

import com.aapno.aapnorajasthan.entity.Ad;
import com.aapno.aapnorajasthan.repository.AdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@CrossOrigin(origins = "http://localhost:8081") // Local aur Live dono ke liye set
@RestController
@RequestMapping("/api/ads")
public class AdController {

    @Autowired
    private AdRepository adRepository;

    @GetMapping("/all")
    public List<Ad> getAllAds() {
        return adRepository.findAll();
    }

    @PostMapping("/add")
    public Ad addAd(
            @RequestParam("name") String name,
            @RequestParam("position") String position,
            @RequestParam("clickUrl") String clickUrl,
            @RequestParam(value = "image", required = false) MultipartFile file) {

        Ad ad = new Ad();
        ad.setName(name);
        ad.setPosition(position);
        ad.setClickUrl(clickUrl);
        ad.setStatus("Active");

        // Photo Upload System (Local uploads folder mein save karne ke liye)
        if (file != null && !file.isEmpty()) {
            try {
                String uploadDir = "uploads/";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String fileName = "ad_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(uploadDir + fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                ad.setImageUrl("http://localhost:8085/uploads/" + fileName);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return adRepository.save(ad);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteAd(@PathVariable Long id) {
        adRepository.deleteById(id);
        return "Ad Deleted!";
    }
}