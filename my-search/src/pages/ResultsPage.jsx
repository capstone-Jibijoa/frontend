import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 24px;
`;

const ResultsPage = () => {
    return (
        <PageContainer>
        <h1>검색 결과 화면입니다</h1>
        </PageContainer>
    );
};

export default ResultsPage;