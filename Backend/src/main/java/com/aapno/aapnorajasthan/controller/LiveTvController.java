package com.aapno.aapnorajasthan.controller;

import com.aapno.aapnorajasthan.entity.LiveTvSettings;
import com.aapno.aapnorajasthan.entity.LiveTvSchedule;
import com.aapno.aapnorajasthan.repository.LiveTvRepository;
import com.aapno.aapnorajasthan.repository.LiveTvScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 👉 YAHAN FIX KIYA HAI: origins ki jagah originPatterns lagaya hai
@CrossOrigin(originPatterns = "*") 
@RestController
@RequestMapping("/api/livetv")
public class LiveTvController {

    @Autowired
    private LiveTvRepository liveTvRepository;

    @Autowired
    private LiveTvScheduleRepository scheduleRepository;

    // ==========================================
    // 1. LIVE TV SETTINGS
    // ==========================================

    @GetMapping("/current")
    public LiveTvSettings getCurrentSettings() {
        return liveTvRepository.findById(1L).orElseGet(() -> {
            LiveTvSettings defaultSettings = new LiveTvSettings();
            defaultSettings.setId(1L);
            defaultSettings.setStatus("INACTIVE"); // Default status
            return liveTvRepository.save(defaultSettings);
        });
    }

    @PostMapping("/update")
    public LiveTvSettings updateSettings(@RequestBody LiveTvSettings newSettings) {
        newSettings.setId(1L);
        return liveTvRepository.save(newSettings);
    }

    // ==========================================
    // 2. LIVE TV SCHEDULE
    // ==========================================

    @GetMapping("/schedule/all")
    public List<LiveTvSchedule> getAllSchedule() {
        return scheduleRepository.findAll();
    }

    @PostMapping("/schedule/add")
    public LiveTvSchedule addSchedule(@RequestBody LiveTvSchedule schedule) {
        return scheduleRepository.save(schedule);
    }

    @DeleteMapping("/schedule/delete/{id}")
    public void deleteSchedule(@PathVariable Long id) {
        scheduleRepository.deleteById(id);
    }
}