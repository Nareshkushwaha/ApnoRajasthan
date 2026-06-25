package com.aapno.aapnorajasthan.controller;

import com.aapno.aapnorajasthan.entity.News;
import com.aapno.aapnorajasthan.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    // 👉 MAGIC FIX YAHAN HAI: Ab ye API ID (Number) aur Slug (English naam) dono ko samajh legi!
    @GetMapping("/{idOrSlug}")
    public ResponseEntity<News> getNewsByIdOrSlug(@PathVariable String idOrSlug) {
        try {
            // Pehle check karte hain ki kya URL mein ID (number) aayi hai
            Long id = Long.parseLong(idOrSlug);
            News news = newsService.getNewsById(id);
            if (news != null) {
                return ResponseEntity.ok(news);
            }
        } catch (NumberFormatException e) {
            // Agar number nahi hai, to iska matlab backend samajh jayega ki ye English naam (Slug) hai
        }

        // URL Slug se news dhoondhne ka code
        News news = newsService.getNewsByUrlSlug(idOrSlug);
        if (news != null) {
            return ResponseEntity.ok(news);
        } else {
            // Agar news nahi milti to 404 Not Found bhej dega
            return ResponseEntity.notFound().build();
        }
    }
}