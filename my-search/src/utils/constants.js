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

// ============================================================
// QPoll 동적 필드 라벨 생성 함수
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
        return `Q${num}`;
    }
    
    // qpoll_N_응답 형식 체크
    const answerMatch = key.match(/^qpoll_(\d+)_응답$/);
    if (answerMatch) {
        const num = parseInt(answerMatch[1], 10);
        return `A${num}`;
    }
    
    return null;
};

// ============================================================
// 통합 라벨 가져오기 함수
// ============================================================
/**
 * 필드 키에 대한 한글 라벨 반환 (Welcome + QPoll 통합)
 * @param {string} key - 필드 키
 * @returns {string|null} - 한글 라벨 또는 null
 */
export const getFieldLabel = (key) => {
    // 1. 기본 사전에서 찾기
    if (KEY_TO_LABEL_MAP[key] !== undefined) {
        return KEY_TO_LABEL_MAP[key];
    }
    
    // 2. QPoll 동적 필드 체크
    const qpollLabel = getQpollLabel(key);
    if (qpollLabel) {
        return qpollLabel;
    }
    
    // 3. 찾지 못함
    return null;
};