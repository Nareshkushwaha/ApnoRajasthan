package com.aapno.aapnorajasthan.controller;

import com.aapno.aapnorajasthan.entity.StaticPage;
import com.aapno.aapnorajasthan.repository.StaticPageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

// 👉 FIX: Yahan se @CrossOrigin hata diya gaya hai
@RestController
@RequestMapping("/api/pages")
public class StaticPageController {

    @Autowired
    private StaticPageRepository staticPageRepository;

    @GetMapping("/current")
    public StaticPage getCurrentPages() {
        return staticPageRepository.findById(1L).orElseGet(() -> {
            StaticPage defaultPages = new StaticPage();
            return staticPageRepository.save(defaultPages);
        });
    }

    @PostMapping("/update")
    public StaticPage updatePages(@RequestBody StaticPage pages) {
        pages.setId(1L);
        return staticPageRepository.save(pages);
    }
}