import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HomeButton from '../components/HomeButton';
import LoadingIndicator from '../components/LoadingIndicator';
import RecommendationChips from '../components/RecommendationChips';
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
    PaginationContainer,
    PageButton,
    HeaderRow    
} from '../style/ResultPage.styles';

const ResultsLitePage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const query = searchParams.get('q');
    // 데이터 페칭에 사용하는 모델 (URL 기준)
    const urlModel = searchParams.get('model') || 'lite';
    
    // ✨ UI 동기화용 state (검색창 드롭다운 <-> 추천 검색어)
    const [currentUiModel, setCurrentUiModel] = useState(urlModel);

    const { resultsState, setResultsState } = useSearchResults();
    const {
        isLoading,
        error,
        tableData,
        majorFields,
        lastLoadedQuery
    } = resultsState;
    
    const [currentPage, setCurrentPage] = useState(1);

    // URL이 변경되면(예: 뒤로가기) UI 모델 상태도 동기화
    useEffect(() => {
        setCurrentUiModel(urlModel);
    }, [urlModel]);

    useEffect(() => {
        // 데이터 페칭 로직은 urlModel을 기준으로 합니다.
        if (query && query === lastLoadedQuery && urlModel === resultsState.model) {
            setResultsState(prev => ({ ...prev, isLoading: false, error: null }));
            return;
        }
        
        if (!query) {
            setResultsState({
                query: '', model: 'lite', tableData: [], chartData: [], 
                majorFields: [], lastLoadedQuery: '', isLoading: false, error: null 
            });
            return;
        }

        const fetchData = async () => {
            console.log(`Lite 모드 검색 시작 (Model: ${urlModel})`);
            console.time("Lite 모드 검색");
            
            setResultsState(prev => ({ 
                ...prev, 
                isLoading: true, 
                error: null,
                query: query,
                model: urlModel
            }));

            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
                const url = `${API_BASE_URL}/api/search`;
                const body = { query: query }; // Lite 모드는 보통 쿼리만 보냄 (필요시 model 추가)
                
                const searchResponse = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                if (!searchResponse.ok) {
                    throw new Error(`HTTP error! status: ${searchResponse.status}`);
                }

                const data = await searchResponse.json();
                
                const fields = (data.display_fields || []).map(item => item.field || item);
                const fullTableData = data.tableData || [];

                setResultsState(prev => ({
                    ...prev,
                    tableData: fullTableData,
                    majorFields: fields,
                    chartData: [], 
                    lastLoadedQuery: query,
                    isLoading: false,
                    error: null,
                    model: urlModel
                }));
                
                setCurrentPage(1);

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
    }, [query, urlModel, lastLoadedQuery, resultsState.model, setResultsState]);

    // 페이지네이션 로직
    const itemsPerPage = 10;
    const totalPages = Math.ceil(tableData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTableData = tableData.slice(startIndex, startIndex + itemsPerPage);

    const allKeys = tableData.length > 0 ? Object.keys(tableData[0]) : [];
    const otherKeys = allKeys.filter(key => 
        key !== 'panel_id' && !majorFields.includes(key)
    );
    const orderedHeaders = [...new Set([...majorFields, ...otherKeys])];
    
    const pagesPerBlock = 10; 
    const currentBlock = Math.ceil(currentPage / pagesPerBlock); 
    const startPage = (currentBlock - 1) * pagesPerBlock + 1;
    const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);

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
                defaultModel={currentUiModel} // ✨ state 연결
                marginTop="0px" 
                onModelChange={setCurrentUiModel} // ✨ 변경 시 state 업데이트
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
                <SectionTitle style={{ marginTop: '60px', textAlign: 'center', color: '#6b7280' }}>
                    '{query}'에 대한 검색 결과가 없습니다.
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
            
            {/* ✨ RecommendationChips에 현재 UI 모델 전달 */}
            <RecommendationChips currentModel={currentUiModel} />
            
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
                                <td>{startIndex + index + 1}</td>
                                {orderedHeaders
                                    .filter(key => key !== 'panel_id')
                                    .slice(0, 4)
                                    .map((key) => {
                                        const value = row[key];
                                        let displayValue;
                                        const MAX_LENGTH = 30;
                                        
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
                                            <td key={key}>{displayValue}</td>
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