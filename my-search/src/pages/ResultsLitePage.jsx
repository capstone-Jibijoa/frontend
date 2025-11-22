import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HomeButton from '../components/HomeButton';
import LoadingIndicator from '../components/LoadingIndicator';
import { useSearchResults } from '../contexts/SearchResultContext';
import { 
    KEY_TO_LABEL_MAP,
    QPOLL_FIELD_LABEL_MAP, 
    QPOLL_KEYS,          
    simplifyQpollValue   
} from '../utils/constants';
import { 
    ResultsPageContainer, 
    SectionTitle, 
    TableCard, 
    StyledTable, 
    TableHead, 
    TableBody, 
    StyledLink,
    PaginationContainer,
    PageButton,
    HeaderRow    
} from '../style/ResultPage.styles';

const ResultsLitePage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const query = searchParams.get('q');
    const model = searchParams.get('model') || 'lite';
    
    const { resultsState, setResultsState } = useSearchResults();
    const {
        isLoading,
        error,
        tableData,
        majorFields,
        lastLoadedQuery
    } = resultsState;
    
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (query && query === lastLoadedQuery && model === resultsState.model) {
            setResultsState(prev => ({ ...prev, isLoading: false, error: null }));
            return;
        }
        
        if (!query) {
            console.log('query 없음');
            setResultsState({
                query: '', model: 'lite', tableData: [], chartData: [], 
                majorFields: [], lastLoadedQuery: '', isLoading: false, error: null 
            });
            return;
        }
        const fetchData = async () => {
            console.log('Lite 모드 검색 시작');
            console.time("Lite 모드 검색");
            
            setResultsState(prev => ({ 
                ...prev, 
                isLoading: true, 
                error: null,
                query: query,
                model: model
            }));

            try {
                // 환경변수로 백엔드 서버주소 받아오기
                console.log('🔍 ENV:', import.meta.env);
                console.log('🔍 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
                console.log('🔍 MODE:', import.meta.env.MODE);
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
                console.log('📍 Using:', API_BASE_URL);
                const url = `${API_BASE_URL}/api/search`;
                const body = { query: query };
                
                console.log('POST', url);
                
                const searchResponse = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                console.log('Status:', searchResponse.status);

                if (!searchResponse.ok) {
                    throw new Error(`HTTP error! status: ${searchResponse.status}`);
                }

                const data = await searchResponse.json();
                console.log('응답 받음');
                
                const fields = (data.display_fields || []).map(item => {
                    return item.field || item;
                });
                console.log('추출된 필드:', fields);
                
                const fullTableData = data.tableData || [];

                setResultsState(prev => ({
                    ...prev,
                    tableData: fullTableData,
                    majorFields: fields,
                    chartData: [], 
                    lastLoadedQuery: query,
                    isLoading: false,
                    error: null,
                    model: model
                }));
                
                setCurrentPage(1);

                console.log(`${fullTableData.length}개 결과 로드 완료`);
            } catch(e) {
                console.error('Lite 모드 오류:', e);
                setResultsState(prev => ({ 
                    ...prev, 
                    error: e.message, 
                    isLoading: false, 
                    tableData: [] 
                }));
            } finally {
                console.timeEnd("Lite 모드 검색");
            }
        };

        fetchData();
    }, [query, model, lastLoadedQuery, resultsState.model, setResultsState]);

    const itemsPerPage = 10;
    const totalPages = Math.ceil(tableData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTableData = tableData.slice(startIndex, startIndex + itemsPerPage);

    const allKeys = tableData.length > 0 ? Object.keys(tableData[0]) : [];
    const otherKeys = allKeys.filter(key => 
        key !== 'panel_id' && !majorFields.includes(key)
    );
    // 주요 필드 -> 기타 필드 순으로 정렬 (중복 제거)
    const orderedHeaders = [...new Set([...majorFields, ...otherKeys])];
    
    const pagesPerBlock = 10; 
    const currentBlock = Math.ceil(currentPage / pagesPerBlock); 
    const startPage = (currentBlock - 1) * pagesPerBlock + 1;
    const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);

    // 화면에 보여줄 페이지 번호 배열
    const pageNumbers = [];
    if (totalPages > 0) {
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
    }

    const prevBlockPage = startPage - pagesPerBlock;
    const nextBlockPage = startPage + pagesPerBlock;

    const handleRowClick = (panel_id) => {
        navigate(`/detail/${panel_id}`);
    };

    // 헤더 렌더링 함수 (홈버튼 + 검색창)
    const renderHeader = () => (
        <HeaderRow>
            <HomeButton />
            <SearchBar 
                defaultQuery={query} 
                defaultModel={model} 
                marginTop="0px" // SearchBar 자체 여백 제거
            />
        </HeaderRow>
    );

    if (isLoading) {
        return (
            <ResultsPageContainer>
                {renderHeader()}
                <LoadingIndicator message="빠른 검색 중..." />
            </ResultsPageContainer>
        );
    }

    if (tableData.length === 0 && !error) {
        return (
            <ResultsPageContainer>
                {renderHeader()}
                <SectionTitle
                    style={{
                        marginTop: '60px',
                        textAlign: 'center',
                        color: '#6b7280'
                    }}
                >
                    '{query}'에 대한 검색 결과가 없습니다.
                    <br/><br/>
                    <span style={{ fontSize: '14px', color: '#999' }}>
                        (백엔드 응답은 받았지만 tableData가 비어있습니다. F12 콘솔을 확인하세요.)
                    </span>
                </SectionTitle>
            </ResultsPageContainer>
        );
    }

    if (error) {
        return (
            <ResultsPageContainer>
                {renderHeader()}
                <SectionTitle style={{ marginTop: '40px', color: 'red' }}>
                    데이터 로드 실패: {error}
                </SectionTitle>
            </ResultsPageContainer>
        );
    }

    return (
        <ResultsPageContainer>
            {renderHeader()}
            
            <SectionTitle style={{ marginTop: '50px', fontSize: '20px', color: '#6b7280' }}>
                총 {tableData.length}개의 검색 결과
            </SectionTitle>
            
            <TableCard>
                <SectionTitle>검색 결과</SectionTitle>
                <StyledTable>
                    <TableHead>
                        <tr>
                            <th>목록번호</th>
                            {orderedHeaders
                                // panel_id는 제외하고 최대 4개 필드만 표시
                                .filter(key => key !== 'panel_id')
                                .slice(0, 4)
                                .map((key) => (
                                    <th key={key}>
                                        {KEY_TO_LABEL_MAP[key] || QPOLL_FIELD_LABEL_MAP[key] || key}
                                    </th>
                                ))}
                        </tr>
                    </TableHead>
                    <TableBody>
                        {currentTableData.map((row, index) => (
                            <tr 
                                key={row.panel_id || index}
                                onClick={() => handleRowClick(row.panel_id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>
                                    {/* Link를 제거하고 목록 번호만 표시합니다. 행 전체가 클릭 가능합니다. */}
                                    {startIndex + index + 1}
                                </td>

                                {orderedHeaders
                                    .filter(key => key !== 'panel_id')
                                    .slice(0, 4)
                                    .map((key) => {
                                        const value = row[key];
                                        let displayValue;
                                        const MAX_LENGTH = 30; // 축약 기준 길이
                                        
                                        if (value == null || value === '' || value === '미응답') {
                                            displayValue = '미응답';
                                        } 
                                        else if (QPOLL_KEYS.includes(key)) { 
                                            displayValue = simplifyQpollValue(key, value);
                                        } 
                                        else { 
                                            if (Array.isArray(value)) {
                                                displayValue = value.length > 0 ? value.join(', ') : '미응답';
                                            } else if (typeof value === 'object' && value !== null) {
                                                displayValue = String(JSON.stringify(value));
                                            } else {
                                                displayValue = String(value);
                                            }

                                            if (displayValue.length > MAX_LENGTH) {
                                                displayValue = displayValue.substring(0, MAX_LENGTH) + '...';
                                            }
                                        }

                                        return (
                                            <td key={key}>
                                                {displayValue}
                                            </td>
                                        );
                                    })}
                            </tr>
                        ))}
                    </TableBody>
                </StyledTable>
            </TableCard>
            
            <PaginationContainer>
                <PageButton
                    onClick={() => setCurrentPage(prevBlockPage)}
                    disabled={startPage === 1}
                >
                    {'<<'}
                </PageButton>
                <PageButton 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    {'<'}
                </PageButton>
                
                {pageNumbers.map((pageNumber) => (
                    <PageButton
                        key={pageNumber}
                        $active={currentPage === pageNumber} 
                        onClick={() => setCurrentPage(pageNumber)}
                    >
                        {pageNumber}
                    </PageButton>
                ))}
                
                <PageButton 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    {'>'}
                </PageButton>
                <PageButton
                    onClick={() => setCurrentPage(nextBlockPage)}
                    disabled={endPage === totalPages}
                >
                    {'>>'}
                </PageButton>
            </PaginationContainer>
        </ResultsPageContainer>
    );
};

export default ResultsLitePage;