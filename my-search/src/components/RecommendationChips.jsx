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
    { label: "20대 여성 여행", query: "20대 여성들이 선호하는 해외 여행 목적지와 여행 유형은?" },
    { label: "명절 선물", query: "수도권 사람들이 선호하는 명절 선물" },
    { label: "미혼 남성", query: "미혼 남성이 스트레스 받는 상황" },
    { label: "새벽 배송", query: "새벽 배송을 자주 이용하는 30대 주부" },
    { label: "전문직", query: "소득 높은 유망 전문직 종류와 연봉 비교" }
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