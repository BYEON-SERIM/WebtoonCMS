package com.example.cms.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.net.URI;
import java.util.Map;
import java.util.List;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient;

    public GeminiService() {
        // 주소 조작을 최소화하기 위해 기본 빌더로 생성합니다.
        this.webClient = WebClient.builder().build();
    }

    public String generateContent(String prompt) {
        if (apiKey == null || apiKey.trim().isEmpty()) return "키가 없습니다.";

        // 1. 방금 성공한 CMD와 동일한 요청 바디 구성
        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt)
                ))
            )
        );

        try {
            // 2. 방금 성공한 CMD 주소 그대로 사용 (모델: gemini-flash-latest)
            // URI.create를 사용해야 콜론(:)이 깨지지 않고 구글에 전달됩니다.
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + apiKey.trim();
            URI uri = URI.create(url);

            return webClient.post()
                .uri(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .map(res -> {
                    try {
                        // 3. 구글 응답 파싱
                        List<?> candidates = (List<?>) res.get("candidates");
                        Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
                        Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");
                        List<?> parts = (List<?>) content.get("parts");
                        Map<?, ?> firstPart = (Map<?, ?>) parts.get(0);
                        return (String) firstPart.get("text");
                    } catch (Exception e) {
                        return "AI 응답 해석 실패";
                    }
                })
                .block();

        } catch (org.springframework.web.reactive.function.client.WebClientResponseException e) {
            System.err.println("구글 에러: " + e.getResponseBodyAsString());
            return "AI 서비스 오류 (" + e.getStatusCode() + ")";
        } catch (Exception e) {
            return "연결 실패: " + e.getMessage();
        }
    }
}