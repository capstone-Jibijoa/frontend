import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// 검색창 컨테이너
const SearchContainer = styled.div`
    position: relative;
    width: 50%;
    min-width: 320px;
    height: 56px;
    margin-top: ${props => (props.$marginTop !== undefined ? props.$marginTop : '30px')};
    border-radius: 28px;
    border: 1px solid #D466C9;
    background-color: #fff;
    box-shadow: 0px 8px 24px rgba(17, 17, 26, 0.05);
    display: flex;
    align-items: center;
`;

// 검색모드를 선택하는 드롭다운
const StyledSelect = styled.select`
    appearance: none;
    border: none;
    outline: none;
    background-color: transparent;

    height: 100%;
    padding: 0 35px 0 20px;

    font-size: 16px;
    font-weight: bold;
    color: #333;
    cursor: pointer;

    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-down' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
    
    &:focus {
        outline: none;
    }
`;

// 구분선
const Separator = styled.div`
    width: 1px;
    height: 24px;
    background-color: #e0e0e0; // 연한 회색 구분선
`;

// 검색어 스타일(placeholder 포함)
const SearchInput = styled.input`
    border: none;
    outline: none;
    background-color: transparent;

    flex-grow: 1;
    height: 100%;
    padding: 0 60px 0 15px;
    box-sizing: border-box;
    
    font-size: 16px;
    text-align: left;

    min-width: 0%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    
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
    z-index: 1;
`;

const getPlaceholderText = (currentModel) => {
        if (currentModel === 'lite') {
            // 'lite'일 때
            return "2.5 Pro에서 인사이트를 검색해보세요.";
        }
        // 'pro'일 때
        return "검색어를 입력하세요."; 
};

const SearchBar = ({ defaultQuery = '', defaultModel = 'lite', marginTop }) => {
    // 검색어를 저장할 state(초기값은 props로 받은 defaultQuery)
    const [query, setQuery] = useState(defaultQuery);
    const [model, setModel] = useState(defaultModel);
    // placeholder을 관리한 state
    const [placeholder, setPlaceholder] = useState(getPlaceholderText(defaultModel));
    // 모델 선택을 위한 state
    
    const navigate = useNavigate();
    
    // 검색 모드가 바뀔 때
    useEffect(() => {
        setModel(defaultModel);
        setPlaceholder(getPlaceholderText(defaultModel));
    }, [defaultModel]);

    // 검색어가 바뀌면 state가 바뀜
    useEffect(() => {
        setQuery(defaultQuery);
    }, [defaultQuery]);

    // input 값이 바뀔 때마다 state를 업데이트
    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const handleModelChange = (event) => {
        const newModel = event.target.value;
        setModel(newModel);

        if (query === "") {
            setPlaceholder(getPlaceholderText(newModel));
        }
    };

    const handleSearch = () => {
        const searchQuery = query.trim();
        
        if (!searchQuery) {
            return;
        }
        
        if (model === 'lite') {
            navigate(`/results-lite?q=${encodeURIComponent(searchQuery)}&model=lite`);
        } else {
            navigate(`/results?q=${encodeURIComponent(searchQuery)}&model=pro`);
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
            setPlaceholder(getPlaceholderText(model));
        }
    }

    return (
        <SearchContainer $marginTop={marginTop}>
            <StyledSelect onChange={handleModelChange} value={model}>
                <option value="lite">2.0 Lite</option>
                <option value="pro">2.5 Pro</option>
            </StyledSelect>
            <Separator />
            <SearchInput
                type="text"
                placeholder={placeholder}
                value={query} // state와 input 값을 연결
                onChange={handleInputChange} // state 변경 함수 연결
                onKeyDown={handleKeyDown} // Enter 키 이벤트 연결
                onFocus={handleFocus}
                onBlur={handleBlur}
                $hasValue={query.length > 0}
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