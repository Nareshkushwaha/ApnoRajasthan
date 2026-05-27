package com.aapno.aapnorajasthan.controller;

import com.aapno.aapnorajasthan.entity.Category;
import com.aapno.aapnorajasthan.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 👉 FIX: Yahan se bhi @CrossOrigin hata diya gaya hai!
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/all")
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @PostMapping("/add")
    public Category addCategory(@RequestBody Category category) {
        return categoryRepository.save(category);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return "Category Deleted!";
    }
}