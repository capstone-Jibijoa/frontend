import styled, { keyframes } from "styled-components";

// 배경색 그라데이션 애니메이션
const moveGradient = keyframes`
    0% {
        background-position: 0% 0%;
    }
    50% {
        background-position: 100% 100%;
    }
    100% {
        background-position: 0% 0%;
    }
`;

// 페이지 전체를 감싸는 컨테이너
export const PageWrapper = styled.div`
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    margin: 0 auto;
    padding: 95px 80px 0px 80px;
    box-sizing: border-box;

    background: 
        linear-gradient(
            0deg, 
            rgba(255, 215, 0, 0.6) 0%,
            transparent 30%,
            rgba(255, 215, 0, 0.6) 100%
        ),
        linear-gradient(
            -70deg, 
            rgba(207, 87, 195, 1) 0%,  
            rgba(250, 205, 211, 1) 50%, 
            rgba(120, 10, 238, 1) 100% 

        ); 


    background-size: 400% 400%;
    animation: ${moveGradient} 10s ease infinite;

    display: flex;
    flex-direction: column;
    align-items: center;
`;

// 헤드라인 스타일
export const Headline = styled.h1`
    font-size: 76px;
    font-weight: 800;
    color: #1f2937;
    text-align: center;
    line-height: 1.2;
    margin: 0;
    letter-spacing: -2px;
`;