package com.aapno.aapnorajasthan.repository;

import com.aapno.aapnorajasthan.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional; // Import zaroori hai

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    
    // Category ke hisab se news nikalne ke liye custom method
    List<News> findByCategory(String category);
    
    // 👉 MAGIC FIX: URL Slug se news nikalne ke liye method add kiya
    Optional<News> findByUrlSlug(String urlSlug);
    
    // Pagination ke liye Spring Data JPA apna kaam khud kar lega!
}