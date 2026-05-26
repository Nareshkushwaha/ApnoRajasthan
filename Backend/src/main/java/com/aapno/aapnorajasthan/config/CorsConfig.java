package com.aapno.aapnorajasthan.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    // 1. React (Port 8081 Admin & Port 8080 Website) dono ko API call karne ki permission dena
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Sabhi API endpoints par allow karna
                // 👉 NAYA BADAAL: Yahan 8081 ke sath 8080 bhi add kar diya hai!
                .allowedOrigins("http://localhost:8081", "http://localhost:8080") 
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    // 2. Local 'uploads' folder se image ko browser me dikhane ki permission dena
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}