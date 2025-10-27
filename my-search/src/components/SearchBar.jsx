import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// --- 스타일 코드는 이전과 동일합니다 ---
const SearchContainer = styled.div`
    position: relative;
    width: 50%; /* 사용자님이 설정하신 50% */
    max-width: 720px;
    margin-top: 40px;
`;

const SearchInput = styled.input`
    width: 100%;
    height: 56px;
    padding: 0 40px;
    border-radius: 28px;
    border: 1px solid #D466C9;
    font-size: 16px;
    box-shadow: 0px 8px 24px rgba(17, 17, 26, 0.05);
    text-align: center;

    &::placeholder {
        color: #999;
    }
`;

const SearchIcon = styled.div`
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    cursor: pointer;
    width: 24px;
    height: 24px;
`;

// --- 🎨 여기서부터 로직이 업그레이드됩니다! 🎨 ---

// 'defaultQuery'라는 props를 받도록 설정합니다.
const SearchBar = ({ defaultQuery = '' }) => {
  // 1. 검색어를 저장할 state를 만듭니다. 초기값은 props로 받은 defaultQuery입니다.
    const [query, setQuery] = useState(defaultQuery);
    const navigate = useNavigate();

  // 2. (중요!) URL이 바뀌면(다른 검색어) state도跟着바뀌도록 설정
    useEffect(() => {
        setQuery(defaultQuery);
    }, [defaultQuery]);

  // 3. input 값이 바뀔 때마다 state를 업데이트합니다.
    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

  // 4. 검색 실행: Enter 또는 클릭 시
    const handleSearch = () => {
        if (query.trim() !== '') {
        // '/search' 페이지로 이동하되, URL에 ?q=검색어 를 붙여서 보냅니다.
        navigate(`/search?q=${query}`);
        }
    };

  // 5. Enter 키를 눌렀을 때도 검색이 실행되도록 합니다.
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
        handleSearch();
        }
    };

    return (
        <SearchContainer>
        <SearchInput
            type="text"
            placeholder="궁금한 모든 것을 검색해 보세요"
            value={query} // state와 input 값을 연결
            onChange={handleInputChange} // state 변경 함수 연결
            onKeyDown={handleKeyDown} // Enter 키 이벤트 연결
        />
        <SearchIcon onClick={handleSearch}> {/* 클릭 이벤트 연결 */}
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