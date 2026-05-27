package com.aapno.aapnorajasthan.controller;

import com.aapno.aapnorajasthan.entity.News;
import com.aapno.aapnorajasthan.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature; 

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
@RequestMapping("/api/admin/news")
public class AdminNewsController {

    @Autowired
    private NewsService newsService;

    @GetMapping("/all/paged")
    public ResponseEntity<Page<News>> getPagedNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<News> newsPage = newsService.getAllNewsPaged(pageable);
        
        return ResponseEntity.ok(newsPage);
    }

    @PostMapping(value = "/add", consumes = {"multipart/form-data"})
    public News addNews(
            @RequestPart("news") String newsJson, 
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            News news = objectMapper.readValue(newsJson, News.class);
            
            if (imageFile != null && !imageFile.isEmpty()) {
                String uploadDir = "uploads/";
                File directory = new File(uploadDir);
                
                if (!directory.exists()) {
                    directory.mkdir();
                }

                String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
                Path filePath = Paths.get(uploadDir + fileName);

                Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                // 👉 MAGIC FIX: localhost hata diya!
                String fileUrl = "/uploads/" + fileName;
                news.setImageUrl(fileUrl);
            }
            
            return newsService.createNews(news);
            
        } catch (Exception e) {
            e.printStackTrace(); 
            throw new RuntimeException("News save nahi ho payi: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public String deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return "News Deleted Successfully!";
    }
    
    @PostMapping(value = "/upload/editor-image")
    public java.util.Map<String, Object> uploadEditorImage(@RequestParam("upload") MultipartFile file) {
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        try {
            if (file != null && !file.isEmpty()) {
                String uploadDir = "uploads/";
                File directory = new File(uploadDir);
                if (!directory.exists()) {
                    directory.mkdir();
                }

                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(uploadDir + fileName);

                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                // 👉 MAGIC FIX: Yahan se bhi localhost hata diya!
                String fileUrl = "/uploads/" + fileName;

                response.put("uploaded", 1);
                response.put("fileName", fileName);
                response.put("url", fileUrl);
                return response;
            }
        } catch (Exception e) {
            System.out.println("Editor image upload error: " + e.getMessage());
        }
        
        response.put("uploaded", 0);
        java.util.Map<String, String> error = new java.util.HashMap<>();
        error.put("message", "Upload failed");
        response.put("error", error);
        return response;
    }
}