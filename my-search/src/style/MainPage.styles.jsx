import styled from "styled-components";

// 페이지 전체를 감싸는 컨테이너
export const PageWrapper = styled.div`
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    margin: 0 auto;
    padding: 100px 80px 0px 80px;
    box-sizing: border-box;

    background: linear-gradient(
        170deg, 
        #c157eb 0%,
        #f8b9bf 25%,
        #FBFAFA 40%,
        #FBFAFA 60%,
        #8540cf 85%,
        #780aee 100%
    );

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