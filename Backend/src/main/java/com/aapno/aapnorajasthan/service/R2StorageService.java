package com.aapno.aapnorajasthan.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class R2StorageService {

    @Autowired
    private AmazonS3 amazonS3;

    @Value("${cloudflare.r2.bucket-name}")
    private String bucketName;

    @Value("${cloudflare.r2.endpoint}")
    private String endpoint;

    // 👉 Naya variable public URL ke liye
    @Value("${cloudflare.r2.public-url}")
    private String publicUrl;

    public String uploadFile(MultipartFile file) {

        try {

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            amazonS3.putObject(
                    bucketName,
                    fileName,
                    file.getInputStream(),
                    metadata
            );

            // 👉 MAGIC FIX: Ab public URL return hoga jisse image site par dikhegi!
            // Agar publicUrl ke last me '/' nahi hai, toh add kar dete hain
            String finalPublicUrl = publicUrl.endsWith("/") ? publicUrl : publicUrl + "/";
            return finalPublicUrl + fileName;

        } catch (Exception e) {
            throw new RuntimeException("R2 Upload Failed : " + e.getMessage());
        }
    }
}