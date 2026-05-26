package com.aapno.aapnorajasthan.repository;

import com.aapno.aapnorajasthan.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
}