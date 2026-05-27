package com.aapno.aapnorajasthan.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 1. Image/Uploads folder ko public karne ke liye (Local + Live dono jagah chalega)
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }

    // 2. CORS Setting - Universal Allow (Localhost, Live IP, Domain sabke liye)
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // 👉 MAGIC LINE: 'allowedOriginPatterns("*")' 
                // "*" ka matlab hai - chahe Localhost ho, IP ho, ya .com Domain ho, sabko allow karo!
                .allowedOriginPatterns("*") 
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}