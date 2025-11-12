# 집이조아 프로젝트 프론트엔드

이 리포지토리는 AI 기반 패널 데이터 검색 및 분석 대시보드의 **프론트엔드(React)** 소스 코드입니다.

사용자의 자연어 질의를 기반으로 백엔드 API와 통신하여, 동적 차트 분석 및 상세 패널 데이터를 테이블 뷰로 제공합니다.

----------

## 사용된 기술

* **React (Vite)**
* **JavaScript (ES6+)**
* **React Router (v6)**: 페이지 라우팅 (`MainPage`, `ResultsPage`, `DetailPage`)
* **Styled-Components**: 컴포넌트 기반 스타일링 및 `.styles.jsx` 분리
* **Recharts**: `CategoryPieChart` 등 동적 데이터 시각화
* **Fetch API**: 비동기 API 통신 (백엔드 연결)

----------

##  실행 방법

### 1. Repository 클론

git clone [GitHub 리포지토리 주소]
cd [프로젝트 폴더명]

### 2. 의존성 설치

npm install

### 3. 개발 서버 실행

npm start

----------

## 폴더 구조

src/
├── components/       # 공용 컴포넌트
│   ├── CategoryPieChart.jsx
│   ├── Footer.jsx
|   ├── LoadingIndicator.jsx 
│   └── SearchBar.jsx
├── pages/            # 페이지 단위 컴포넌트
│   ├── MainPage.jsx
│   ├── ResultsPage.jsx
│   ├── DetailPage.jsx
├── style/            # 페이지 별 스타일
│   ├── MainPage.styles.jsx
│   ├── ResultsPage.styles.jsx
│   ├── DetailPage.styles.jsx
├── utils/            # 유틸리티 및 공용 데이터
│   └── constants.js    (KEY_TO_LABEL_MAP)
├── App.jsx           # 라우터 (App)
└── main.jsx          # 엔트리 포인트

----------

## API 및 데이터 흐름

이 프로젝트는 백엔드 API와 2단계에 걸쳐 통신하여 데이터를 로드합니다.

1. 검색 요청

