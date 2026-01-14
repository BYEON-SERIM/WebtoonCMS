package com.example.cms.controller;

import com.example.cms.domain.WebtoonLog;
import com.example.cms.repository.WebtoonLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {
    private final WebtoonLogRepository logRepository;

    @GetMapping
    public List<WebtoonLog> getLogs() {
        // 최신순으로 10개만 가져오기
        return logRepository.findAll(Sort.by(Sort.Direction.DESC, "id")).stream().limit(10).toList();
    }

    @PostMapping
    public WebtoonLog addLog(@RequestBody WebtoonLog log) {
        return logRepository.save(log);
    }
}