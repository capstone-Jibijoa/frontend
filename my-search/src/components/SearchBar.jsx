import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// 검색창 컨테이너
const SearchContainer = styled.div`
    position: relative;
    width: 50%;
    min-width: 720px;
    margin-top: ${props => (props.marginTop !== undefined ? props.marginTop : '30px')};
`;

// 검색어 스타일(placeholder 포함)
const SearchInput = styled.input`
    width: 100%;
    height: 56px;
    padding: 0 10px;
    border-radius: 28px;
    border: 1px solid #D466C9;
    font-size: 16px;
    box-shadow: 0px 8px 24px rgba(17, 17, 26, 0.05);
    text-align: center;

    &::placeholder {
        color: #999;
    }
`;

// 검색 버튼 스타일
const SearchIcon = styled.div`
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    cursor: pointer;
    width: 24px;
    height: 24px;
`;

const originalPlaceholder = "궁금한 모든 것을 검색해 보세요";

// 'defaultQuery'라는 props를 받도록 설정합니다.
const SearchBar = ({ defaultQuery = '', marginTop }) => {
    // 검색어를 저장할 state(초기값은 props로 받은 defaultQuery)
    const [query, setQuery] = useState(defaultQuery);
    
    // placeholder을 관리한 state
    const [placeholder, setPlaceholder] = useState(originalPlaceholder);
    const navigate = useNavigate();

    // 검색어가 바뀌면 state가 바뀜
    useEffect(() => {
        setQuery(defaultQuery);
    }, [defaultQuery]);

    // input 값이 바뀔 때마다 state를 업데이트
    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    // 검색 실행(Enter 또는 클릭)
    const handleSearch = () => {
        if (true) {
        // query를 붙여 /search로 이동
        navigate(`/search?q=${query}`);
        }
    };

    // Enter 키를 눌렀을 때도 검색이 실행되도록 합니다.
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
        handleSearch();
        }
    };

    // 검색창을 클릭했을 때 실행
    const handleFocus = () => {
        setPlaceholder("");
    }

    // 검색창 외 다른 곳을 클릭했을 때 실행
    const handleBlur = () => {
        if (query === "") {
            setPlaceholder(originalPlaceholder);
        }
    }

    return (
        <SearchContainer $marginTop={marginTop}>
        <SearchInput
            type="text"
            placeholder={placeholder}
            value={query} // state와 input 값을 연결
            onChange={handleInputChange} // state 변경 함수 연결
            onKeyDown={handleKeyDown} // Enter 키 이벤트 연결
            onFocus={handleFocus}
            onBlur={handleBlur}
        />
        <SearchIcon onClick={handleSearch}> {/* 클릭 이벤트 연결 */}
            <svg // 확대해도 깨지지 않게 하기위해 svg를 사용
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