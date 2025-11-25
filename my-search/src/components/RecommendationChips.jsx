import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// 전체 컨테이너
const Container = styled.div`
    width: 50%;           
    min-width: 320px;     
    margin-top: 16px;     
    
    display: grid;        
    grid-template-columns: repeat(5, 1fr); 
    gap: 8px;             
    justify-content: center;
`;

// 2. 개별 버튼 (Chip): 꽉 채우기 & 둥근 모서리
const Chip = styled.button`
    width: 100%;          
    background-color: #ffffff;
    border: 1px solid #D466C9;
    border-radius: 999px; 
    padding: 8px 4px;       
    
    font-size: 13px;
    font-weight: 500;
    color: #3c4043;
    cursor: pointer;
    transition: all 0.2s ease;
    
    /* 말 줄임 처리 */
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

const RECOMMENDED_KEYWORDS = [
    { label: "20대 남성 차량", query: "20대 남성이 많이 타는 차" },
    { label: "OTT 이용자", query: "서울, 경기 OTT 이용하는 젊은 층 30명" },
    { label: "전문직", query: "소득 높은 유망 전문직 종류와 연봉 비교" },
    { label: "새벽 배송", query: "새벽 배송을 자주 이용하는 30대 주부" },
    { label: "30대 주부", query: "30대 주부의 취미생활" }
];

const RecommendationChips = ({ currentModel = 'lite' }) => {
    const navigate = useNavigate();

    const handleChipClick = (query) => {
        if (currentModel === 'lite') {
            navigate(`/results-lite?q=${encodeURIComponent(query)}&model=lite`);
        } else {
            navigate(`/results?q=${encodeURIComponent(query)}&model=pro`);
        }
    };

    return (
        <Container>
            {RECOMMENDED_KEYWORDS.map((item, index) => (
                <Chip 
                    key={index} 
                    onClick={() => handleChipClick(item.query)}
                    title={item.label}
                >
                    {item.label}
                </Chip>
            ))}
        </Container>
    );
};

export default RecommendationChips;