package com.example.cms.scheduler;

import com.example.cms.domain.Webtoon;
import com.example.cms.domain.WebtoonLog;
import com.example.cms.repository.WebtoonLogRepository;
import com.example.cms.repository.WebtoonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebtoonScheduler {

    private final WebtoonRepository webtoonRepository;
    private final WebtoonLogRepository logRepository;

    // 1분마다 실행 (매 분 0초에 실행)
    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void autoPublishWebtoons() {
        LocalDateTime now = LocalDateTime.now();
        
        List<Webtoon> reservedToons = webtoonRepository.findAllByStatusAndScheduledAtBefore("발행예약", now);

        if (!reservedToons.isEmpty()) {
            for (Webtoon webtoon : reservedToons) {
                // 2. 상태 변경 (발행예약 -> 연재중)
                webtoon.setStatus("연재중");
                webtoon.setScheduledAt(null); // 예약 시간 비우기

                // 3. 로그 남기기 (이게 경력직 포인트!)
                WebtoonLog publishLog = new WebtoonLog(
                    "시스템 예약 발행 완료: [" + webtoon.getTitle() + "]", 
                    "success"
                );
                logRepository.save(publishLog);
                
                log.info("자동 발행 완료: {}", webtoon.getTitle());
            }
        }
    }
}