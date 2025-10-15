import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// 검색창을 감싸는 컨테이너
const SearchContainer = styled.div`
    position: relative;
    width: 720px;
    margin-top: 40px;
    border: D466C9;
`;

// 실제 입력 필드
const SearchInput = styled.input`
    width: 100%;
    height: 56px;
    //padding: 0 40px;
    border-radius: 28px;
    /* border: 1px solid #ddd;  <- 이 부분을 아래처럼 수정 */
    border: 1px solid #D466C9; /* 더 연한 회색 테두리 */
    font-size: 16px;
    /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); <- 이 부분을 아래처럼 수정 */
    box-shadow: 0px 8px 24px rgba(17, 17, 26, 0.05); /* 더 부드러운 그림자 */

    text-align: center;

    &::placeholder {
        color: #999;
    }
`;

// 검색 아이콘 (SVG를 사용해 아이콘 폰트 없이도 렌더링)
const SearchIcon = styled.div`
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
    width: 24px;
    height: 24px;
`;

const SearchBar = () => {
    // 2. '이동 리모컨'을 사용할 준비를 합니다.
    const navigate = useNavigate();

    // 3. 아이콘을 클릭하면 '/search' 페이지로 이동시키는 함수를 만듭니다.
    const handleIconClick = () => {
        navigate('/search');
    };
    return (
        <SearchContainer>
      {/* input의 기능은 나중에 추가할 것이므로 잠시 그대로 둡니다. */}
        <SearchInput
            type="text"
            placeholder="궁금한 모든 것을 검색해 보세요"
        />
        {/* 4. 아이콘에 onClick 이벤트를 추가해서, 클릭하면 handleIconClick 함수를 실행하게 합니다. */}
        <SearchIcon onClick={handleIconClick}>
            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="#555"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
            </svg>
        </SearchIcon>
    </SearchContainer>
    );
};

export default SearchBar;