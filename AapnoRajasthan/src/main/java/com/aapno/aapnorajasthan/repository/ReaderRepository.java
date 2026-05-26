package com.aapno.aapnorajasthan.repository;

import com.aapno.aapnorajasthan.entity.Reader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReaderRepository extends JpaRepository<Reader, Long> {
    // Login ke time email se reader dhoondhne ke liye
    Optional<Reader> findByEmail(String email);
    
    // Signup ke time check karne ke liye ki email pehle se hai ya nahi
    boolean existsByEmail(String email);
}