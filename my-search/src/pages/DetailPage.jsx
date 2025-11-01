import React from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';

const DetailContainer = styled.div`
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 40px 80px;
    box-sizing: border-box;
`;

const Title = styled.h1`
    font-size: 32px;
    font-weight: 700;
`;

const BackButton = styled.button`
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    background-color: #ffffff;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #f9fafb;
    }
`;

const DetailPage = () => {
    // 3. URL에서 :id 값을 읽어옵니다. (예: /detail/A1 -> id는 "A1"이 됨)
    const { id } = useParams();

    // 4. 페이지 이동 함수(뒤로 가기)를 준비합니다.
    const navigate = useNavigate();

    return (
        <DetailContainer>
        {/* 5. '뒤로 가기' 버튼 (navigate(-1)은 브라우저의 '뒤로' 버튼과 동일) */}
        <BackButton onClick={() => navigate(-1)}>
            {'<'} 뒤로 가기
        </BackButton>

        <Title>상세 정보 페이지</Title>
        <p>
            선택하신 항목의 ID는 **{id}** 입니다.
        </p>
        <p>
            (앞으로 이 페이지에 {id}에 해당하는 상세 데이터를 표시할 것입니다.)
        </p>
        </DetailContainer>
    );
};

export default DetailPage;