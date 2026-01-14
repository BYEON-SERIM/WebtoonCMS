package com.example.cms.service;

import com.example.cms.domain.DailyStat;
import com.example.cms.domain.Webtoon;
import com.example.cms.dto.WebtoonRequest;
import com.example.cms.repository.DailyStatRepository;
import com.example.cms.repository.WebtoonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DailyStatService {
    private final DailyStatRepository dailyStatRepository;

    public List<DailyStat> getDailyStats() {
        return dailyStatRepository.findAllByOrderByStatDateAsc();
    }
}