package com.aapno.aapnorajasthan.repository;

import com.aapno.aapnorajasthan.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    // Category ke hisab se news nikalne ke liye custom method (e.g., "Politics", "Sports")
    List<News> findByCategory(String category);
    
    // Pagination ke liye Spring Data JPA apna kaam khud kar lega!
}