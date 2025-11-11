import styled from "styled-components";
import { Link } from "react-router-dom";

// 페이지 전체 컨테이너
export const PageContainer = styled.div`
    width: 100%;
    max-width: 1440px;
    min-height: 100vh;
    margin: 0 auto;
    padding: 0px 80px 40px 80px;
    box-sizing: border-box;
    background-color: #fbfbfbff; 
    display: flex;
    flex-direction: column;
    align-items: center;
`;

// 상세 정보가 들어갈 카드
export const DetailCard = styled.div`
    border-radius: 0px;
    margin-top: 40px;
    width: 100%;
`;

// 6칸 그리드 컨테이너
export const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    border-radius: 0px;
    overflow: hidden;
`;

// '제목'과 '값'을 감싸는 하나의 셀
export const InfoItem = styled.div`
    border-bottom: 1px solid #e5e7eb;
    border-right: 1px solid #e5e7eb;

    &:nth-child(6n) {
        border-right: none;
    }
    
    &:nth-child(n+7) {
        border-bottom: none;
    }
`;

// 항목의 제목칸
export const InfoKey = styled.div`
    padding: 12px 16px;
    background-color: #f9fafb; /* 회색 배경 */
    border-bottom: 1px solid #e5e7eb; /* 값과 분리되는 선 */
    font-size: 14px;
    font-weight: 600;
    color: #6b7280;
    text-align: center;
`;

// 항목의 값칸
export const InfoValue = styled.div`
    padding: 16px;
    background-color: #ffffff; /* 흰색 배경 */
    font-size: 16px;
    font-weight: 500;
    color: #111827;
    text-align: center;
    min-height: 24px;
`;

// 돌아가기 버튼
export const BackButton = styled.button`
    margin-top: 32px;
    padding: 12px 32px;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    background-color: #D466C9;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #c157eb;
    }
`;