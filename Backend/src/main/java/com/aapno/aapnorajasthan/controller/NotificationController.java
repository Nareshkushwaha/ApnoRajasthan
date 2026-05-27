package com.aapno.aapnorajasthan.controller;

import com.aapno.aapnorajasthan.entity.Notification;
import com.aapno.aapnorajasthan.repository.NotificationRepository;
import com.aapno.aapnorajasthan.repository.UserRepository; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 👉 FIX: Yahan se 'localhost:8081' wala @CrossOrigin hata diya
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository; 

    @GetMapping("/all")
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @PostMapping("/send")
    public Notification sendNotification(@RequestBody Notification notification) {
        
        long realUserCount = userRepository.count();
        notification.setRecipients((int) realUserCount);
        
        return notificationRepository.save(notification);
    }
}