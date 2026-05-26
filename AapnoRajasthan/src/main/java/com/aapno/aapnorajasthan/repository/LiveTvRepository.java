package com.aapno.aapnorajasthan.repository;

import com.aapno.aapnorajasthan.entity.LiveTvSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LiveTvRepository extends JpaRepository<LiveTvSettings, Long> {
    // सरलता के लिए हम पहला रिकॉर्ड ही उठाएंगे
}