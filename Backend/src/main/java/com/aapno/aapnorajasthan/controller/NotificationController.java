package com.aapno.aapnorajasthan.controller;

import com.aapno.aapnorajasthan.entity.Notification;
import com.aapno.aapnorajasthan.repository.NotificationRepository;
import com.aapno.aapnorajasthan.repository.UserRepository; // 👉 Ye import kiya
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:8081") 
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository; // 👉 Database se asali users nikalne ke liye

    // Saari history dekhne ke liye
    @GetMapping("/all")
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    // Naya notification bhejne ke liye
    @PostMapping("/send")
    public Notification sendNotification(@RequestBody Notification notification) {
        
        // 1. Apne MySQL database se total registered users count nikalo
        long realUserCount = userRepository.count();

        // 2. Wahi asali count 'recipients' me set kar do
        notification.setRecipients((int) realUserCount);
        
        // 3. Notification ko database me save kar do
        return notificationRepository.save(notification);
    }
}