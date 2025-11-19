import styled from 'styled-components';
import { Link } from 'react-router-dom';

// 페이지 전체를 감싸는 컨테이너
export const ResultsPageContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    margin: 0 auto;
    padding: 0px 80px 20px 80px;
    box-sizing: border-box;
    background-color: #fbfbfbff;
    /* 
    background: linear-gradient( 
        #f1f3f7ff  0%,
        #e3ddddff 30%
    ); */ 
    display: flex;
    flex-direction: column;
    align-items: center;
`;

// 차트를 감싸는 흰색 카드
export const SummaryCard = styled.section`
    background-color: #ffffff;
    border-radius: 16px;
    padding: 32px;
    margin-top: 30px;
    margin-bottom: 0px;
    border: 1px solid #D466C9; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    width: 100%;
`;

// 'Table'에 사용할 섹션 제목
export const SectionTitle = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: #111827; 
    margin-top: 0;
    margin-bottom: 24px;
`;

// 'AI 요약 정리'에 사용할 섹션 제목
export const ChartTitle = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0px;
    width: 100%;
    text-align: left;
`

export const ChartRow = styled.div`
    display: flex;
    gap: 24px; /* 차트 사이의 간격 */
    flex-wrap: wrap; /*차트가 여러 개일 때 자동으로 줄바꿈 */
    justify-content: center;
`;

// 테이블
export const TableCard = styled.section`
    background-color: #ffffff;
    border-radius: 16px;
    padding: 32px;
    margin-top: 30px; 
    border: 1px solid #D466C9; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    width: 100%;
`;

export const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse; /* 테두리 선을 한 줄로 합침 */
    text-align: left; /* 기본 정렬은 왼쪽 */
`;

// 테이블 헤드
export const TableHead = styled.thead`
    background-color: #f9fafb; /* 헤더 배경색 */
    
    th {
        font-size: 14px;
        font-weight: 600;
        color: #6b7280; /* 연한 회색 글씨 */
        padding: 12px 16px;
        border-bottom: 2px solid #e5e7eb;
        text-align: center;
        &:first-child {
            text-align: left;
        }
    }
`;

// 테이블 바디
export const TableBody = styled.tbody`
    tr {
        /* 한 줄씩 번갈아가며 배경색을 칠합니다 (zebra striping) */
        &:nth-child(even) {
        background-color: #f9fafb;
        }
    }

    td {
        font-size: 14px;
        color: #374151; /* 진한 회색 글씨 */
        padding: 12px 16px;
        border-bottom: 1px solid #e5e7eb;
        text-align: center;
        &:first-child {
            text-align: left;
        }
    }
`;

export const StyledLink = styled(Link)`
    color: #374151; /* 테이블 텍스트와 동일한 색상 */
    text-decoration: none; /* 밑줄 제거 */

    :hover {
    text-decoration: underline; /* 마우스 올리면 밑줄 표시 */
    color: #D466C9; /* 포인트 컬러 */
    }
`;

// 페이징 버튼을 감싸는 컨테이너
export const PaginationContainer = styled.nav`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 32px;
    width: 100%;
`;

// "Previous", "Next", "1", "2", "3" 버튼
export const PageButton = styled.button`
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid #FBCFE8;
    background-color: #ffffff;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    /* 마우스를 올렸을 때 효과 */
    &:hover {
        background-color: #f9fafb;
    }

    /* 'active' prop이 true일 때 적용될 스타일 */
    ${(props) =>
        props.$active &&
        `
        background-color: #D466C9;
        border-color: #D466C9;
        color: #ffffff;
        font-weight: 700;
    `}

    /* 비활성화되었을 때 */
    &:disabled {
        color: #9ca3af;
        cursor: not-allowed;
        background-color: #f9fafb;
    }
`;

const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    width: 100%;
    margin-top: 30px;
`;