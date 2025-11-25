import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// 전체 컨테이너
const Container = styled.div`
    width: 50%;           /* 화면의 50% */
    min-width: 320px;     /* 최소 너비 */
    margin-top: 16px;     /* 위쪽 여백 */
    
    display: grid;        /* 그리드 레이아웃 사용 */
    grid-template-columns: repeat(5, 1fr); /* 정확히 5등분 */
    gap: 8px;             /* 버튼 사이 간격 */
    justify-content: center;
`;

// 개별 추천 질문
const Chip = styled.button`
    width: 100%;          
    background-color: #ffffff;
    border: 1px solid #D466C9;
    border-radius: 999px; /* 완전 둥근 알약 모양 */
    padding: 8px 0;       /* 위아래 패딩만 줌 (좌우는 width 100%라 자동) */
    
    font-size: 13px;
    font-weight: 500;
    color: #3c4043;
    cursor: pointer;
    transition: all 0.2s ease;
    
    /* 말줄임 처리 (글자가 너무 길면 ...으로 표시) */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        background-color: #e8eaed;
        border-color: #dadce0;
        color: #202124;
        transform: translateY(-1px);
    }

    &:active {
        background-color: #dadce0;
        transform: translateY(0);
    }
`;

// 로딩/에러 메시지 컨테이너
const MessageContainer = styled.div`
    width: 50%;
    min-width: 320px;
    margin-top: 16px;
    display: flex;
    justify-content: center;
    color: #ef4444; /* 에러 색상 */
    font-size: 14px;
`;

// API 응답을 시뮬레이션할 고정 데이터
const MOCK_API_RESPONSE = [
    "AI 트렌드 분석",
    "React 상태관리",
    "Styled Components",
    "Next.js 튜토리얼",
    "서울 사람 20명"
];

// props로 현재 선택된 model을 받아서, 클릭 시 해당 모델로 검색되게 함
const RecommendationChips = ({ currentModel = 'lite' }) => {
    const navigate = useNavigate();
    const [keywords, setKeywords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    // 컴포넌트 마운트 시 API 요청 시뮬레이션
    useEffect(() => {
        const fetchKeywords = async () => {
            setIsLoading(true);
            setIsError(false);

            try {
                // 성공적으로 데이터를 받아왔다고 가정
                setKeywords(MOCK_API_RESPONSE);
            } catch (error) {
                console.error("Failed to fetch recommended keywords:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchKeywords();
    }, []);

    // 태그 클릭 핸들러
    const handleChipClick = (keyword) => {
        // 현재 선택된 모델에 따라 경로 분기 처리
        if (currentModel === 'lite') {
            navigate(`/results-lite?q=${encodeURIComponent(keyword)}&model=lite`);
        } else {
            navigate(`/results?q=${encodeURIComponent(keyword)}&model=pro`);
        }
    };

    if (isLoading) {
        return null;
    }
    
    // 2. 오류 발생 시
    if (isError) {
        return (
            <MessageContainer>
                추천 검색어를 불러오지 못했습니다.
            </MessageContainer>
        );
    }

    // 3. 정상적으로 데이터를 받아왔을 때
    return (
        <Container>
            {keywords.map((keyword, index) => (
                <Chip 
                    key={index} 
                    onClick={() => handleChipClick(keyword)}
                    title={keyword} // 마우스 올리면 전체 텍스트 보임
                >
                    {keyword}
                </Chip>
            ))}
        </Container>
    );
};

export default RecommendationChips;