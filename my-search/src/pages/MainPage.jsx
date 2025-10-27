import React from 'react';
import styled from 'styled-components';
import SearchBar from '../components/SearchBar';
import Dashboard from '../components/Dashboard';
import Footer from '../components/Footer';

// 페이지 전체를 감싸는 컨테이너. 이제 이 자체가 배경이 됩니다.
const PageWrapper = styled.div`
    width: 100%;
    max-width: 1440px;
    padding-left: 80px;
    padding-right: 80px;
    box-sizing: border-box;

    min-height: 1540px; /* 최소 높이를 1540px로 설정 */
    margin: 0 auto; /* 화면 중앙에 위치시킴 */
    
    background: linear-gradient(
        170deg, 
        #c157eb 0%,
        #cf57c3 10%,
        #8f41e3 13%,
        #b955e0 17%,
        #f8b9bf 22%,
        #ffffff 27%,
        #ffffff 65%,
        #ffffff 70%,
        #787ae5 75%,
        #8540cf 86%,
        #780aee 100%
    );

  /* 내부 콘텐츠들을 정렬합니다 */
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;
    

    
`;

// 헤드라인 스타일 (이전과 동일)
const Headline = styled.h1`
    font-size: 76px;
    font-weight: 800;
    color: #1f2937;
    text-align: center;
    line-height: 1.2;
    margin: 0;
    letter-spacing: -2px;
`;

const MainPage = () => {
    return (
        <PageWrapper>
        <Headline>
            Creative Way
            <br />
            For Insight
        </Headline>
        <SearchBar />
        <Dashboard />
        <Footer />
        </PageWrapper>
    );
};

export default MainPage;