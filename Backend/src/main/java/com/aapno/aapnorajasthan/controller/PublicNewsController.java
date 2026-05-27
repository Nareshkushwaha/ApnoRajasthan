package com.aapno.aapnorajasthan.controller;

import com.aapno.aapnorajasthan.entity.News;
import com.aapno.aapnorajasthan.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news") 
public class PublicNewsController {

    @Autowired
    private NewsService newsService;

    @GetMapping("/all")
    public List<News> getAllNews() {
        return newsService.getAllNews();
    }

    @GetMapping("/category/{category}")
    public List<News> getNewsByCategory(@PathVariable String category)
    {
        return newsService.getNewsByCategory(category);
    }

    @GetMapping("/{id}")
    public News getNewsById(@PathVariable Long id) {
        return newsService.getNewsById(id);
    }
}