import React from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar'; // 메인페이지 검색창 재사용

// 페이지 전체를 감싸는 컨테이너
const ResultsPageContainer = styled.div`
    width: 100%;
    max-width: 1440px;
    min-height: 100vh;
    margin: 0 auto;
    padding: 40px 80px;
    box-sizing: border-box;
    background-color: #f9fafb;

    display: flex;
    flex-direction: column;
    align-items: center;
`;

// 'AI 요약 정리' 섹션을 감싸는 흰색 카드
const SummaryCard = styled.section`
    background-color: #ffffff;
    border-radius: 16px;
    padding: 32px;
    margin-top: 40px;
    border: 1px solid #FBCFE8; /* 연한 핑크색 테두리 */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    width: 100%;
`;

// "AI 요약 정리", "Table" 등에 사용할 공통 섹션 제목
const SectionTitle = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: #111827; /* 진한 회색 */
    margin-top: 0;
    margin-bottom: 24px;
`;

const ChartGridContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px; /* 차트 행(row) 사이의 간격 */
`;

const ChartRow = styled.div`
    display: flex;
    gap: 24px; /* 차트 사이의 간격 */
`;

// 차트 하나하나를 감싸는 박스
const ChartBox = styled.div`
    flex: 1; /* 행 안의 공간을 차트들이 똑같이 나눠 가짐 */
    border: 1px solid #e5e7eb; /* 차트 박스의 연한 테두리 */
    border-radius: 8px;
    padding: 16px;
    background-color: #ffffff;
`;

// 차트 제목 (Fruit, meat 등)
const ChartTitle = styled.h3`
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    margin-top: 0;
    margin-bottom: 16px;
    text-align: center;
`;

// 실제 차트가 그려질 영역을 표시하는 회색 상자
const ChartPlaceholder = styled.div`
    width: 100%;
    height: 250px; /* 차트 높이 임시 지정 */
    background-color: #f3f4f6; /* 연한 회색 배경 */
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #9ca3af;
`;
const ResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    
    return (
        <ResultsPageContainer>
        <SearchBar defaultQuery={query} />

        <SummaryCard>
            <SectionTitle>AI 요약 정리</SectionTitle>
            
            {/* --- ✍️ 여기에 새로운 JSX 구조가 들어갑니다! ✍️ --- */}
            <ChartGridContainer>
            {/* 첫 번째 행: 차트 2개 */}
            <ChartRow>
                <ChartBox>
                <ChartTitle>Fruit</ChartTitle>
                <ChartPlaceholder>차트</ChartPlaceholder>
                </ChartBox>
                <ChartBox>
                <ChartTitle>meat</ChartTitle>
                <ChartPlaceholder>차트</ChartPlaceholder>
                </ChartBox>
            </ChartRow>

            {/* 두 번째 행: 차트 3개 */}
            <ChartRow>
                <ChartBox>
                <ChartTitle>직업</ChartTitle>
                <ChartPlaceholder>차트</ChartPlaceholder>
                </ChartBox>
                <ChartBox>
                <ChartTitle>나이</ChartTitle>
                <ChartPlaceholder>차트</ChartPlaceholder>
                </ChartBox>
                <ChartBox>
                <ChartTitle>결혼</ChartTitle>
                <ChartPlaceholder>차트</ChartPlaceholder>
                </ChartBox>
            </ChartRow>
            </ChartGridContainer>
            
        </SummaryCard>
    </ResultsPageContainer>
    );
};

export default ResultsPage;