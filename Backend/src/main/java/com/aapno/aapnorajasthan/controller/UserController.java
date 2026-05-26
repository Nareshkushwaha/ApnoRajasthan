package com.aapno.aapnorajasthan.controller;

import com.aapno.aapnorajasthan.entity.User;
import com.aapno.aapnorajasthan.dto.LoginRequest;
import com.aapno.aapnorajasthan.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/add")
    public User addUser(@RequestBody User user) { return userService.createUser(user); }

    @GetMapping("/all")
    public List<User> getAllUsers() { return userService.getAllUsers(); }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) { return userService.getUserById(id); }

    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "User Deleted Successfully!";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
        if (user != null) return ResponseEntity.ok(user);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Email or Password");
    }

    // 👉 NAYA: OTP Send karne ka API
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String status = userService.sendOtp(request.get("email"));
        if (status.equals("Success")) {
            return ResponseEntity.ok("OTP Sent");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(status);
    }

    // 👉 NAYA: Password Reset karne ka API
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String status = userService.verifyOtpAndResetPassword(
                request.get("email"), request.get("otp"), request.get("newPassword"));
        
        if (status.equals("Success")) {
            return ResponseEntity.ok("Password Reset Successful");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(status);
    }
}