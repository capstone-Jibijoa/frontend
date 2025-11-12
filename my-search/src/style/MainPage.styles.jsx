import styled, { keyframes } from "styled-components";

// 배경색 그라데이션 애니메이션
const moveGradient = keyframes`
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
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
        /* 가장 위에 겹쳐질 그라데이션 */
        linear-gradient(
            -80deg, 
            rgba(173, 255, 47, 0.8) 0%,   /* 밝은 연두색 */
            transparent 30%,    
            rgba(255, 255, 0, 0.73) 100%   /* 노란색 */
        ),
        /* 그 아래에 깔릴 베이스 그라데이션 */
        linear-gradient(
            0deg, 
            rgba(193, 87, 235, 0.8) 0%,   /* 보라색 */
            //rgba(248, 185, 191, 0.88) 50%,  /* 살구색 */
            //rgba(251, 250, 250, 0.7) 65%,  /* 흰색 */
            rgba(250, 134, 213, 0.71) 100%   /* 진한 보라색 */
        );

    background-size: 400% 400%;
    animation: ${moveGradient} 10s ease infinite;

  /* 내부 콘텐츠들을 정렬 */
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