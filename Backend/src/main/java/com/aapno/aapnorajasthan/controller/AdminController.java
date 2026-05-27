package com.aapno.aapnorajasthan.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {

    @GetMapping("/admin")
    public String admin() {
        // 👉 FIX: localhost hata diya gaya hai.
        return "redirect:/";
    }
}