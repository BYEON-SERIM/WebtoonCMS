package com.example.cms.repository;

import com.example.cms.domain.Webtoon;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WebtoonRepository extends JpaRepository<Webtoon, Long> {
	// '발행예약' 데이터 조회
    List<Webtoon> findAllByStatusAndScheduledAtBefore(String status, LocalDateTime dateTime);
}