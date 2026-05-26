package com.aapno.aapnorajasthan.controller;

import com.aapno.aapnorajasthan.dto.LoginRequest;
import com.aapno.aapnorajasthan.entity.User;
import com.aapno.aapnorajasthan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

// Dono (localhost aur IP address) ko allow kar do
@CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.41:8081"})
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        
        // 1. Email se user dhoondo
        User user = userRepository.findByEmail(loginRequest.getEmail());

        // 2. Agar user mil jaye aur password match ho jaye
        if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
            
            // Password hide karke baaki details React ko bhej do
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("role", user.getRole()); // Admin ya Editor
            
            // Ek dummy token bana rahe hain abhi frontend lock karne ke liye
            response.put("token", "aapno-rajasthan-secret-token-" + user.getId());

            return ResponseEntity.ok(response);
        } else {
            // Agar details galat hain
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Email or Password");
        }
    }
}