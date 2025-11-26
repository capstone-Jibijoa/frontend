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
    display: flex;
    flex-direction: column;
    align-items: center;
`;

// 차트를 감싸는 흰색 카드
export const SummaryCard = styled.section`
    background-color: #ffffff;
    border-radius: 16px;
    padding: 32px;
    margin-top: 0px;
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
    gap: 24px;
    flex-wrap: wrap;
    justify-content: center;
`;

// 테이블
export const TableCard = styled.section`
    background-color: #ffffff;
    border-radius: 16px;
    padding: 32px;
    margin-top: 32px; 
    border: 1px solid #D466C9; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    width: 100%;
`;

export const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    text-align: left;
`;

// 테이블 헤드
export const TableHead = styled.thead`
    background-color: #f9fafb;
    
    th {
        font-size: 14px;
        font-weight: 600;
        color: #6b7280;
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
        &:nth-child(even) {
        background-color: #f9fafb;
        }
    }

    td {
        font-size: 14px;
        color: #374151;
        padding: 12px 16px;
        border-bottom: 1px solid #e5e7eb;
        text-align: center;
        &:first-child {
            text-align: left;
        }
    }
`;

export const StyledLink = styled(Link)`
    color: #374151;
    text-decoration: none;

    :hover {
    text-decoration: underline;
    color: #D466C9;
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

    &:hover {
        background-color: #f9fafb;
    }

    ${(props) =>
        props.$active &&
        `
        background-color: #D466C9;
        border-color: #D466C9;
        color: #ffffff;
        font-weight: 700;
    `}

    &:disabled {
        color: #9ca3af;
        cursor: not-allowed;
        background-color: #f9fafb;
    }
`;

export const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    width: 100%;
    margin-top: 30px;
`;

// 요약 카드
export const TextSummaryCard = styled.div`
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #D466C9;
    border-radius: 20px;

    display: flex;
    flex-direction: column;
    padding: 32px;

    margin-top: 16px; 
    margin-bottom: 16px;
    
    height: auto;
    
    transition: all 0.3s ease;
`;

// 요약 제목
export const SummaryHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
    width: 100%;

    &:hover {
        opacity: 0.8;
    }

    h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        color: #D466C9;
        display: flex;
        align-items: center;
    }
`;

// 토글 아이콘
export const ToggleIcon = styled.div`
    font-size: 1.5rem;
    color: #D466C9;

    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
    transition: transform 0.1s ease;
    margin-left: 12px;
`;

// 요약 내용
export const SummaryContent = styled.div`
    color: #011119ff;
    font-size: 1.1rem;
    line-height: 1.6;
    white-space: pre-line;
    width: 100%;
    
    max-height: ${props => props.$isOpen ? '1000px' : '0'};
    opacity: ${props => props.$isOpen ? '1' : '0'};
    overflow: hidden;
    margin-top: ${props => props.$isOpen ? '16px' : '0'};
    transition: all 0.4s ease-in-out;
`;