package com.aapno.aapnorajasthan.service;

import com.aapno.aapnorajasthan.entity.News;
import com.aapno.aapnorajasthan.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NewsService {

    @Autowired
    private NewsRepository newsRepository;

    // Nayi news save karna
    public News createNews(News news) {
        return newsRepository.save(news);
    }
    
    // Saari news lana (Bina Pagination)
    public List<News> getAllNews() {
        return newsRepository.findAll();
    }

    // Pagination ke sath news lane ke liye naya method
    public Page<News> getAllNewsPaged(Pageable pageable) {
        return newsRepository.findAll(pageable);
    }

    // ID se news lana
    public News getNewsById(Long id) {
        // Agar id nahi milti toh null return karega ya error dega
        return newsRepository.findById(id).orElse(null); 
    }
    
    // 👉 MAGIC FIX YAHAN HAI: Ab ye English naam (Slug) se bhi news nikal layega!
    public News getNewsByUrlSlug(String urlSlug) {
        return newsRepository.findByUrlSlug(urlSlug).orElse(null);
    }
    
    // Category ke hisab se news lana
    public List<News> getNewsByCategory(String category) {
        return newsRepository.findByCategory(category);
    }

    // News delete karna
    public void deleteNews(Long id) {
        newsRepository.deleteById(id);
    }
}