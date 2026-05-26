//package com.aapno.aapnorajasthan.controller;
//
//import com.aapno.aapnorajasthan.dto.SignupRequest;
//import com.aapno.aapnorajasthan.service.AuthService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@CrossOrigin(originPatterns = "*")
//@RestController
//@RequestMapping("/api/public/auth") // 👉 NAYA URL: /api/public/auth
//public class PublicAuthController {
//
//    @Autowired
//    private AuthService authService;
//
//    // Signup API (URL: /api/public/auth/signup)
//    @PostMapping("/signup")
//    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
//        String result = authService.signupReader(request);
//        
//        if (result.startsWith("Error")) {
//            return ResponseEntity.badRequest().body(result);
//        }
//        return ResponseEntity.ok(result);
//    }
//}