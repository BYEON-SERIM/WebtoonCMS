# 🎨 Webtoon AI-Admin & Analytics System

웹툰 관리 효율을 극대화하고, **Google Gemini AI 엔진**을 통해 작품 데이터를 지능적으로 분석 및 큐레이션하는 관리자 대시보드 프로젝트입니다.

---

## 🛠 Tech Stack
- **AI Engine**: Google Gemini AI (Smart Curation & Data Analysis)
- **Frontend**: Vue 3, Vuetify 3 (Material Design Library)
- **Backend**: Spring Boot 3.4, Spring Data JPA
- **Data Access**: Spring Data JPA
- **Database**: H2 Database / MySQL
- **Language**: Java 17
- **Library**: Lombok, Gradle

---

## 🚀 주요 기능 (Key Features)

### 1. 작품 큐레이션 관리
웹툰의 노출 순서를 **Drag & Drop**으로 직관적으로 관리합니다.
장르별 필터링을 통해 카테고리별 최적의 작품 배치를 지원하며, 변경 이력을 실시간으로 확인할 수 있습니다.

<img width="80%" alt="image" src="https://github.com/user-attachments/assets/1fa4ffb4-b67d-42e3-bbdd-65f3f3762ef6" />

### 2. 작품 마스터 관리 (AI 탐색 포함)
전체 웹툰 데이터의 CRUD를 담당합니다. 
특히 **AI 시놉시스 탐색기** 기능을 통해 제목이 기억나지 않아도 줄거리나 소재만 입력하면 AI가 관련 작품을 찾아주는 지능형 검색을 지원합니다.
또한, **작품 등록 시 Gemini AI가 줄거리를 분석하여 적절한 태그를 자동으로 생성**해주며, 시놉시스만으로 작품을 찾아주는 스마트 탐색 기능을 지원합니다.

<img width="80%" alt="image" src="https://github.com/user-attachments/assets/fa351f71-4085-463b-a3bf-4e65bee34f34" />

<img width="45%" alt="image" src="https://github.com/user-attachments/assets/3dcf53b9-2763-4159-9a72-240b9ca1ca00" />
<img width="45%" alt="image" src="https://github.com/user-attachments/assets/5f842b27-8980-46be-82b4-44943b9416c6" />

### 3. 조회수 통계 분석
플랫폼 내 조회수 데이터를 시각화하여 제공합니다. 

<img width="80%" alt="image" src="https://github.com/user-attachments/assets/1f953bfe-f79e-4b02-b3f8-4fc2f992abb9" />

---

## 💡 핵심 개발 포인트
- **AI 기반 비정형 검색**: Gemini AI를 활용하여 줄거리(시놉시스) 기반의 지능형 작품 탐색 구현.
- **인터랙티브 UI/UX**: Vue 3와 Vuetify를 활용한 반응형 대시보드 및 드래그 앤 드롭 정렬 시스템.
- **안전한 데이터 관리**: JPA 파라미터 바인딩 및 쿼리 메소드를 활용한 보안성 높은 백엔드 설계.
