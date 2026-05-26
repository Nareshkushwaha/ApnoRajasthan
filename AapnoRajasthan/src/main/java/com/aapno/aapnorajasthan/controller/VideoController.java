package com.aapno.aapnorajasthan.controller;

import com.aapno.aapnorajasthan.entity.Video;
import com.aapno.aapnorajasthan.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/videos")
public class VideoController {

    @Autowired
    private VideoRepository videoRepository;

    @GetMapping("/all")
    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Video getVideoById(@PathVariable Long id) {
        return videoRepository.findById(id).orElse(null);
    }

    @PostMapping("/add")
    public Video addVideo(@RequestBody Video video) {
        return videoRepository.save(video);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteVideo(@PathVariable Long id) {
        videoRepository.deleteById(id);
        return "Video Deleted!";
    }
}