import React from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar'; // 메인페이지 검색창 재사용
import CategoryPieChart from '../components/CategoryPieChart'; // 차트 컴포넌트 재사용

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

const fruitData = [
    { name: 'egg fruit', value: 15 },
    { name: 'apple', value: 23 },
    { name: 'banana', value: 19 },
    { name: 'carrot', value: 15 },
    { name: 'dewberry', value: 27 },
];

const meatData = [
    { name: 'duck', value: 15 },
    { name: 'pork', value: 23 },
    { name: 'beef', value: 19 },
    { name: 'chicken', value: 15 },
    { name: 'lamb', value: 27 },
];

const jobData = [
    { name: 'A', value: 15 },
    { name: 'B', value: 23 },
    { name: 'C', value: 19 },
    { name: 'D', value: 15 },
    { name: 'E', value: 27 },
];

const ageData = jobData;
const marriageData = jobData;

const ResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    
    
    return (
        <ResultsPageContainer>
            <SearchBar defaultQuery={query} />

            <SummaryCard>
                <SectionTitle>AI 요약 정리</SectionTitle>

                <ChartGridContainer>
                    {/* 첫 번째 행: 차트 2개 */}
                    <ChartRow>
                        <CategoryPieChart title="Fruit" data={fruitData} />
                        <CategoryPieChart title="meat" data={meatData} isDoughnut={true} />
                    </ChartRow>

                    {/* 두 번째 행: 차트 3개 */}
                    <ChartRow>
                        <CategoryPieChart title="직업" data={jobData} />
                        <CategoryPieChart title="나이" data={ageData} />
                        <CategoryPieChart title="결혼" data={marriageData} />
                    </ChartRow>
                </ChartGridContainer>

            </SummaryCard>
        </ResultsPageContainer>
    ); 
};

export default ResultsPage;