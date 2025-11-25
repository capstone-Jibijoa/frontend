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
    "20대 트렌드",
    "주말 여가",
    "재택 만족도",
    "선호 운동",
    "1인 식단"
];

const RecommendationChips = ({ currentModel = 'lite' }) => {
    const navigate = useNavigate();

    const handleChipClick = (keyword) => {
        if (currentModel === 'lite') {
            navigate(`/results-lite?q=${encodeURIComponent(keyword)}&model=lite`);
        } else {
            navigate(`/results?q=${encodeURIComponent(keyword)}&model=pro`);
        }
    };

    return (
        <Container>
            {RECOMMENDED_KEYWORDS.map((keyword, index) => (
                <Chip 
                    key={index} 
                    onClick={() => handleChipClick(keyword)}
                    title={keyword}
                >
                    {keyword}
                </Chip>
            ))}
        </Container>
    );
};

export default RecommendationChips;