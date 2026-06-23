package com.aapno.aapnorajasthan.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 1. Image/Uploads folder ko public karne ke liye
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }

    // 2. 👉 Naya aur Powerful CORS Filter (Jo Spring Security ko bhi bypass karega)
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*"); // Sab allow karega
        config.addAllowedHeader("*");        // Saare headers allow
        config.addAllowedMethod("*");        // GET, POST, PUT, DELETE sab allow
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}