package com.example.cms.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class) // 중요: 이 리스너가 있어야 시간을 감시함
public class WebtoonLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private String color;

    @CreatedDate // 데이터 생성 시 자동으로 시간 주입
    @Column(updatable = false) // 수정 시에는 시간이 변하지 않도록 설정
    private LocalDateTime createdAt;

    public WebtoonLog(String message, String color) {
        this.message = message;
        this.color = color;
    }
}