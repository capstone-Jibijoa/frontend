import React from 'react';
import styled, { keyframes } from 'styled-components';

// 회전 애니메이션
const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

// 스피너 스타일
const Spinner = styled.div`
    border: 5px solid #f3f3f3;
    border-top: 5px solid #D466C9;
    border-radius: 50%;
    width: 70px;
    height: 70px;
    animation: ${spin} 1s linear infinite;
`;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    margin-top: 60px;
`;

const LoadingText = styled.p`
    font-size: 20px;
    font-weight: 600;
    color: #374151; 
`;

const LoadingIndicator = ({ message = "불러오는 중..." }) => {
    return (
        <LoadingContainer>
        <Spinner />
        <LoadingText>{message}</LoadingText>
        </LoadingContainer>
    );
};

export default LoadingIndicator;