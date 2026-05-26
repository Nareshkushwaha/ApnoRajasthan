package com.aapno.aapnorajasthan.repository;

import com.aapno.aapnorajasthan.entity.Ad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdRepository extends JpaRepository<Ad, Long> {
}