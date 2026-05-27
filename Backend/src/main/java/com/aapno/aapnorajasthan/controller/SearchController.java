package com.aapno.aapnorajasthan.controller;

import com.aapno.aapnorajasthan.entity.News;
import com.aapno.aapnorajasthan.entity.User;
import com.aapno.aapnorajasthan.entity.Video;
import com.aapno.aapnorajasthan.entity.Message; 

import com.aapno.aapnorajasthan.repository.NewsRepository;
import com.aapno.aapnorajasthan.repository.UserRepository;
import com.aapno.aapnorajasthan.repository.VideoRepository;
import com.aapno.aapnorajasthan.repository.MessageRepository; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// 👉 FIX: Yahan se 'localhost:8081' wala @CrossOrigin hata diya
@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired private UserRepository userRepository;
    @Autowired private NewsRepository newsRepository;
    @Autowired private VideoRepository videoRepository;
    @Autowired private MessageRepository messageRepository; 

    @GetMapping
    public Map<String, Object> globalSearch(@RequestParam String q) {
        Map<String, Object> results = new HashMap<>();
        String searchWord = q.toLowerCase();

        // 1. USERS
        List<User> matchedUsers = new ArrayList<>();
        for (User u : userRepository.findAll()) {
            if ((u.getName() != null && u.getName().toLowerCase().contains(searchWord)) ||
                (u.getEmail() != null && u.getEmail().toLowerCase().contains(searchWord))) {
                matchedUsers.add(u);
            }
        }
        results.put("users", matchedUsers);

        // 2. NEWS (ARTICLES)
        List<News> matchedNews = new ArrayList<>();
        for (News n : newsRepository.findAll()) {
            if ((n.getTitle() != null && n.getTitle().toLowerCase().contains(searchWord)) ||
                (n.getCategory() != null && n.getCategory().toLowerCase().contains(searchWord)) ||
                (n.getAuthor() != null && n.getAuthor().toLowerCase().contains(searchWord))) {
                matchedNews.add(n);
            }
        }
        results.put("articles", matchedNews); 

        // 3. VIDEOS
        List<Video> matchedVideos = new ArrayList<>();
        for (Video v : videoRepository.findAll()) {
            if ((v.getTitle() != null && v.getTitle().toLowerCase().contains(searchWord)) ||
                (v.getCategory() != null && v.getCategory().toLowerCase().contains(searchWord))) {
                matchedVideos.add(v);
            }
        }
        results.put("videos", matchedVideos);

        // 4. MESSAGES
        List<Message> matchedMessages = new ArrayList<>();
        try {
            for (Message m : messageRepository.findAll()) {
                if ((m.getName() != null && m.getName().toLowerCase().contains(searchWord)) ||
                    (m.getSubject() != null && m.getSubject().toLowerCase().contains(searchWord)) ||
                    (m.getEmail() != null && m.getEmail().toLowerCase().contains(searchWord))) {
                    matchedMessages.add(m);
                }
            }
        } catch (Exception e) {
            System.out.println("Message fetch karne mein problem aayi: " + e.getMessage());
        }
        results.put("messages", matchedMessages);

        return results;
    }
}