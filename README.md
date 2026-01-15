# Webtoon CMS

웹툰 서비스의 백오피스 기능을 구현한 프로젝트로, 작품 마스터 데이터 관리(CRUD)와 플랫폼 지표 모니터링 기능을 중심으로 설계되었습니다. 

특히 최신 AI 기술(Gemini)을 도입하여 운영자의 업무 편의성을 높이는 데 집중했습니다.

---

## Tech Stack
- **AI Engine**: Google Gemini AI (Smart Curation & Data Analysis)
- **Frontend**: Vue 3, Vuetify 3 (Material Design Library)
- **Backend**: Spring Boot 3.4, Spring Data JPA
- **Data Access**: Spring Data JPA
- **Database**: MySQL
- **Language**: Java 17
- **Library**: Lombok, Gradle

---

## 메뉴 설명

### 1. 작품 큐레이션
웹툰의 노출 순서를 **Drag & Drop**으로 직관적으로 관리합니다.
장르별 필터링을 통해 카테고리별 최적의 작품 배치를 지원하며, 변경 이력을 실시간으로 확인할 수 있습니다.

<img width="80%" alt="image" src="https://github.com/user-attachments/assets/5913b153-3e54-4ba4-b47e-58c3021d687c" />


### 2. 작품 목록 관리
전체 웹툰 데이터의 CRUD를 담당합니다. 
특히 **AI 시놉시스 탐색기** 기능을 통해 제목이 기억나지 않아도 줄거리나 소재만 입력하면 AI가 관련 작품을 찾아주는 지능형 검색을 지원합니다.
또한, **작품 등록 시 Gemini AI가 줄거리를 분석하여 적절한 태그를 자동으로 생성**해주며, 시놉시스만으로 작품을 찾아주는 스마트 탐색 기능을 지원합니다.

<img width="80%" alt="image" src="https://github.com/user-attachments/assets/0f78b433-e75a-4737-8daa-1516d51b63b7" />

<img width="45%" alt="image" src="https://github.com/user-attachments/assets/3dcf53b9-2763-4159-9a72-240b9ca1ca00" />
<img width="45%" alt="image" src="https://github.com/user-attachments/assets/5f842b27-8980-46be-82b4-44943b9416c6" />

### 3. 조회수 통계
플랫폼 내 조회수 데이터를 시각화하여 제공합니다. 

<img width="80%" alt="image" src="https://github.com/user-attachments/assets/348ee76a-4693-4162-ab76-44dbaf6b5e35" />


---

## 핵심 개발 포인트
- **AI 기반 비정형 검색**: Gemini AI를 활용하여 줄거리(시놉시스) 기반의 지능형 작품 탐색 구현.
- **인터랙티브 UI/UX**: Vue 3와 Vuetify를 활용한 반응형 대시보드 및 드래그 앤 드롭 정렬 시스템.
- **안전한 데이터 관리**: JPA 파라미터 바인딩 및 쿼리 메소드를 활용한 보안성 높은 백엔드 설계.
