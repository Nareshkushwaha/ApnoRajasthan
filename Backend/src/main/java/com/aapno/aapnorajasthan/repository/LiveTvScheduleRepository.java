package com.aapno.aapnorajasthan.repository;

import com.aapno.aapnorajasthan.entity.LiveTvSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LiveTvScheduleRepository extends JpaRepository<LiveTvSchedule, Long> {
}