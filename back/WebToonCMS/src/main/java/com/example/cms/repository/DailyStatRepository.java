package com.example.cms.repository;

import com.example.cms.domain.DailyStat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DailyStatRepository extends JpaRepository<DailyStat, Long> {
    // 날짜 오름차순으로 전체 통계 가져오기
    List<DailyStat> findAllByOrderByStatDateAsc();
}