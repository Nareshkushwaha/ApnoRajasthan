package com.aapno.aapnorajasthan.controller;

import com.aapno.aapnorajasthan.entity.Message;
import com.aapno.aapnorajasthan.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 👉 FIX: Yahan se bhi @CrossOrigin hata diya
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @GetMapping("/all")
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    @PostMapping("/add")
    public Message addMessage(@RequestBody Message message) {
        return messageRepository.save(message);
    }

    @PutMapping("/read/{id}")
    public void markAsRead(@PathVariable Long id) {
        Message m = messageRepository.findById(id).orElse(null);
        if (m != null) {
            m.setRead(true);
            messageRepository.save(m);
        }
    }

    @DeleteMapping("/delete/{id}")
    public String deleteMessage(@PathVariable Long id) {
        messageRepository.deleteById(id);
        return "Message Deleted!";
    }
}