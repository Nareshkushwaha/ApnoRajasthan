package com.aapno.aapnorajasthan.repository;

import com.aapno.aapnorajasthan.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // ईमेल से यूज़र को ढूँढने के लिए कस्टम मेथड
    User findByEmail(String email);
}