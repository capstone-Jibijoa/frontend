export const KEY_TO_LABEL_MAP = {
    "uid": "번호",
    "gender": "성별",
    "birth_year": "출생연도",
    "region_major": "지역",
    "region_minor": "상세 지역",
    "marital_status": "결혼여부",
    "children_count": "자녀수",
    "family_size": "가족 수",
    "education_level": "최종학력",
    "job_title_raw": "직업",
    "job_duty_raw": "직무",
    "income_personal_monthly": "월소득(개인)",
    "income_household_monthly": "월소득(가구)",
    "phone_brand_raw": "휴대폰 브랜드",
    "phone_model_raw": "휴대폰 모델",
    "car_ownership": "차량 보유 여부",
    "car_manufacturer_raw": "차량 제조사",
    "car_model_raw": "차량 모델명",
    "smoking_experience": "흡연 여부",
    "smoking_brand": "담배 종류",
    "smoking_brand_etc_raw": "기타 담배 종류",
    "e_cigarette_experience": "전자 담배 이용 경험",
    "smoking_brand_other_details_raw": "기타 흡연 세부 사항",
    "drinking_experience": "음주 경험",
    "drinking_experience_other_details_raw": "음주 세부 사항"
};

export const QPOLL_FIELD_LABEL_MAP = {
    "physical_activity": "체력 관리 활동",
    "ott_count": "OTT 이용 개수",
    "traditional_market_freq": "전통시장 방문 빈도",
    "lunar_new_year_gift_pref": "설 선물 선호 유형",
    "elementary_winter_memories": "겨울방학 기억",
    "pet_experience": "반려동물 경험",
    "moving_stress_factor": "이사 스트레스 요인",
    "happiest_self_spending": "가장 기분 좋은 소비",
    "most_used_app": "주요 사용 앱",
    "stress_situation": "스트레스 상황",
    "stress_relief_method": "스트레스 해소법",
    "skin_satisfaction": "피부 만족도",
    "skincare_spending": "스킨케어 월 소비",
    "skincare_purchase_factor": "스킨케어 구매 요소",
    "ai_chatbot_used": "AI 챗봇 사용 경험",
    "ai_chatbot_main": "주요 AI 챗봇",
    "ai_chatbot_purpose": "AI 챗봇 활용 용도",
    "ai_chatbot_sentiment": "AI 챗봇 호감도",
    "overseas_travel_pref": "해외여행 선호지",
    "fast_delivery_usage": "빠른 배송 이용 제품",
    "summer_worry": "여름철 주요 걱정",
    "unused_item_disposal": "버리기 아까운 물건 처리",
    "alarm_setting_style": "기상 알람 방식",
    "eating_alone_frequency": "혼밥 빈도",
    "happy_old_age_condition": "행복한 노년 조건",
    "sweat_discomfort": "여름철 땀 불편함",
    "most_effective_diet": "가장 효과적인 다이어트",
    "late_night_snack_method": "야식 섭취 방법",
    "favorite_summer_snack": "여름철 최애 간식",
    "recent_major_spending": "최근 주요 지출처",
    "ai_service_usage_area": "AI 서비스 활용 분야",
    "minimalist_maximalist": "미니멀/맥시멀 성향",
    "travel_planning_style": "여행 스타일",
    "plastic_bag_reduction_effort": "비닐봉투 줄이기 노력",
    "point_benefit_attention": "포인트 혜택 관심도",
    "chocolate_consumption_time": "초콜릿 섭취 시점",
    "personal_info_protection_habit": "개인정보보호 습관",
    "summer_fashion_must_have": "여름 패션 필수템",
    "no_umbrella_reaction": "우산 없을 때 대처",
    "most_saved_photo_type": "갤러리 최다 저장 사진",
    "favorite_summer_water_spot": "여름 물놀이 선호 장소"
};

// **Q-Poll 필드 키 목록 (값 가공 식별용)**
export const QPOLL_KEYS = Object.keys(QPOLL_FIELD_LABEL_MAP);

/**
 * QPoll 응답 텍스트를 테이블 출력용으로 간결하게 가공합니다.
 * @param {string} key - 필드 키 (예: 'ott_count')
 * @param {string} value - 필드의 긴 응답 텍스트
 * @returns {string} 가공된 간결 텍스트
 */
export const simplifyQpollValue = (key, value) => {
    if (!value || typeof value !== 'string' || value === '미응답' || value === '없다') {
        return '미응답';
    }
    
    // 1. 숫자가 포함된 응답 (예: '3개', '4개 이상', '10만원 미만')
    if (key.includes('count') || key.includes('freq') || key.includes('spending')) {
        // "현재 OTT 서비스를 4개 이상 이용 중이다." -> "4개 이상"
        // "5만원 이상 ~ 10만원 미만" -> "5만원~10만원 미만" (범위 처리)
        const match = value.match(/(\d+[^ ]+)/); 
        
        if (value.includes('~')) {
             return value.replace(' 이상', '').replace(' 미만', '').replace(' ', '');
        } else if (match) {
            return match[1].trim();
        }
    }
    
    // 2. 이용하지 않음/없음/기타 응답
    if (value.includes('이용하지 않는다') || value.includes('없다') || value.includes('않음') || value.includes('방문하지 않음')) {
        return value.includes('않는다') || value.includes('않음') ? '이용/방문 안 함' : '없음';
    }
    
    // 3. 괄호로 요약 가능한 응답 (예: '스포츠(축구, 배드민턴 등)' -> '스포츠')
    const parenthesisMatch = value.match(/(.*)\(.*\)/);
    if (parenthesisMatch && parenthesisMatch[1].trim().length > 0) {
        return parenthesisMatch[1].trim();
    }
    
    // 4. 특별한 패턴이 없고 텍스트가 긴 경우 요약
    if (value.length > 20) {
        return value.substring(0, 15) + '...';
    }

    return value; 
};

// ============================================================
// QPoll 동적 필드 라벨 생성 함수 (복구)
// ============================================================
/**
 * QPoll 필드 라벨을 동적으로 생성
 * @param {string} key - 필드 키 (예: "qpoll_001_질문", "qpoll_001_응답")
 * @returns {string|null} - 한글 라벨 또는 null
 */
export const getQpollLabel = (key) => {
    // qpoll_N_질문 형식 체크
    const questionMatch = key.match(/^qpoll_(\d+)_질문$/);
    if (questionMatch) {
        const num = parseInt(questionMatch[1], 10);
        return `Q${num}. 질문`;
    }
    
    // qpoll_N_응답 형식 체크
    const answerMatch = key.match(/^qpoll_(\d+)_응답$/);
    if (answerMatch) {
        const num = parseInt(answerMatch[1], 10);
        return `Q${num}. 응답`;
    }
    
    // qpoll_응답_개수도 라벨링
    if (key === 'qpoll_응답_개수') {
        return 'QPoll 응답 개수';
    }

    return null;
};

// ============================================================
// 통합 라벨 가져오기 함수 (수정)
// ============================================================
/**
 * 필드 키에 대한 한글 라벨 반환 (Welcome + QPoll 통합)
 * @param {string} key - 필드 키
 * @returns {string|null} - 한글 라벨 또는 null
 */
export const getFieldLabel = (key) => {
    // 1. 기본 Welcome 사전에서 찾기
    if (KEY_TO_LABEL_MAP[key] !== undefined) {
        return KEY_TO_LABEL_MAP[key];
    }
    
    // 2. QPoll 영어 필드 사전에서 찾기 (테이블 헤더용)
    if (QPOLL_FIELD_LABEL_MAP[key] !== undefined) {
        return QPOLL_FIELD_LABEL_MAP[key];
    }

    // 3. QPoll 동적 필드 체크 (디테일 페이지용)
    const qpollLabel = getQpollLabel(key);
    if (qpollLabel) {
        return qpollLabel;
    }
    
    return null;
};