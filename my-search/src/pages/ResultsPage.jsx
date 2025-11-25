import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams, useNavigate } from 'react-router-dom';

// 컴포넌트 임포트
import SearchBar from '../components/SearchBar';
import HomeButton from '../components/HomeButton';
import CategoryPieChart from '../components/CategoryPieChart';
import StackedBarChart from '../components/StackedBarChart';
import LoadingIndicator from '../components/LoadingIndicator';
import RecommendationChips from '../components/RecommendationChips';

// Context & Utils
import { useSearchResults } from '../contexts/SearchResultContext';
import { 
    KEY_TO_LABEL_MAP, 
    QPOLL_FIELD_LABEL_MAP, 
    QPOLL_KEYS, 
    simplifyQpollValue 
} from '../utils/constants';

// 스타일 임포트
import { 
    ResultsPageContainer, 
    SummaryCard as ChartContainer, 
    SectionTitle, 
    ChartRow, 
    TableCard, 
    StyledTable, 
    TableHead, 
    TableBody, 
    StyledLink,
    PaginationContainer,
    PageButton,
    HeaderRow
} from '../style/ResultPage.styles';

const TextSummaryCard = styled.div`
    background-color: #f0f9ff; /* 연한 하늘색 배경 */
    border: 1px solid #bae6fd;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    color: #0369a1; /* 진한 파란색 텍스트 */
    font-size: 1.1rem;
    line-height: 1.6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    white-space: pre-line; /* 줄바꿈 문자(\n) 적용 */

    h3 {
        margin: 0 0 12px 0;
        font-size: 1.25rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #0284c7;
        
        &::before {
            content: '📊';
            font-size: 1.4rem;
        }
    }
`;

// 차트 데이터 변환 헬퍼 함수
const transformChartData = (chartValuesObject) => {
    if (!chartValuesObject) return [];
    return Object.entries(chartValuesObject).map(([name, value]) => ({
        name: name,
        value: value
    }));
};

const ResultsPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // URL 파라미터 파싱
    const query = searchParams.get('q');
    const urlModel = searchParams.get('model') || 'pro';
    
    // UI 상태 동기화
    const [currentUiModel, setCurrentUiModel] = useState(urlModel);

    // 전역 검색 결과 상태 (Context)
    const { resultsState, setResultsState } = useSearchResults();
    const {
        isLoading,
        error,
        chartData,
        tableData,
        majorFields,
        lastLoadedQuery,
        searchSummary 
    } = resultsState;
    
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({});

    // URL 모델 변경 시 UI 모델 동기화
    useEffect(() => {
        setCurrentUiModel(urlModel);
    }, [urlModel]);
    
    // 데이터 로딩 로직
    useEffect(() => {
        // 이미 로드된 데이터와 쿼리/모델이 같으면 재요청 방지
        if (query && query === lastLoadedQuery && urlModel === resultsState.model) {
            console.log('이전 검색 결과가 유효하여 API 호출을 건너뜁니다.');
            setResultsState(prev => ({ ...prev, isLoading: false, error: null }));
            return;
        }

        if (!query) {
            setResultsState({
                query: '', model: 'pro', tableData: [], chartData: [], 
                majorFields: [], lastLoadedQuery: '', isLoading: false, error: null,
                searchSummary: null
            });
            return;
        }
        
        const fetchData = async () => {
            console.log(`[${urlModel} 모드] 검색 시작: ${query}`);
            console.time("API 요청 + 데이터 처리");
            
            setResultsState(prev => ({ 
                ...prev, 
                isLoading: true, 
                error: null,
                query: query,
                model: urlModel,
                searchSummary: null // 로딩 시작 시 요약 초기화
            }));

            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
                const url = `${API_BASE_URL}/api/search-and-analyze`;
                const body = { query: query, model: urlModel };
                
                const searchResponse = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                if (!searchResponse.ok) {
                    throw new Error(`HTTP error! status: ${searchResponse.status}`);
                }

                const data1 = await searchResponse.json();
                
                // 차트 데이터 변환
                const report = data1.charts || [];
                const transformedCharts = report.map(chart_raw => {
                    const chartType = chart_raw?.chart_type;
                    const chartValues = chart_raw?.chart_data[0]?.values;

                    if (chartType === 'crosstab') {
                        return {
                            title: chart_raw?.topic,
                            chart_type: chartType,
                            data: chartValues
                        };
                    } else {
                        return {
                            title: chart_raw?.topic,
                            chart_type: chartType,
                            data: transformChartData(chartValues)
                        };
                    }
                });

                const fields = (data1.display_fields || []).map(item => item.field);
                const fullTableData = data1.tableData || [];
                const summaryText = data1.search_summary || null;
                
                // 상태 업데이트
                setResultsState(prev => ({
                    ...prev,
                    chartData: transformedCharts, 
                    tableData: fullTableData,      
                    majorFields: fields,           
                    lastLoadedQuery: query, 
                    isLoading: false,
                    error: null,
                    model: urlModel,
                    searchSummary: summaryText // ✨ 요약문 상태 저장
                }));

                setCurrentPage(1);
                
            } catch(e) {
                console.error('에러:', e);
                setResultsState(prev => ({ 
                    ...prev, 
                    error: e.message, 
                    isLoading: false, 
                    tableData: [], 
                    chartData: [],
                    searchSummary: null
                }));
            } finally {
                console.timeEnd("API 요청 + 데이터 처리");
            }
        };

        fetchData();
    }, [query, urlModel, lastLoadedQuery, resultsState.model, setResultsState]);

    // 필터 핸들러
    const handleFilterChange = (e, key) => {
        setFilters(prev => ({ ...prev, [key]: e.target.value }));
        setCurrentPage(1);
    };

    // 필터링 로직
    const filteredData = tableData.filter(row => {
        return Object.keys(filters).every(key => {
            const filterValue = filters[key];
            if (!filterValue) return true;
            const rowValue = row[key];
            if (rowValue == null) return false;
            return String(rowValue).toLowerCase().includes(filterValue.toLowerCase());
        });
    });

    // 페이지네이션 로직
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTableData = filteredData.slice(startIndex, startIndex + itemsPerPage);
    
    // 테이블 헤더 구성
    const allKeys = tableData.length > 0 ? Object.keys(tableData[0]) : [];
    const otherKeys = allKeys.filter(key => 
        key !== 'panel_id' && !majorFields.includes(key)
    );
    const orderedHeaders = [...new Set([...majorFields, ...otherKeys])];
    
    // 페이지 블록 계산
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

    // 헤더 렌더링
    const renderHeader = () => (
        <HeaderRow>
            <HomeButton />
            <SearchBar 
                defaultQuery={query} 
                defaultModel={currentUiModel} 
                marginTop="0px"
                onModelChange={setCurrentUiModel} 
            />
        </HeaderRow>
    );

    // 로딩 상태
    if (isLoading) {
        return (
            <ResultsPageContainer>
                {renderHeader()}
                <LoadingIndicator message="데이터를 분석하고 인사이트를 도출 중입니다..." />
            </ResultsPageContainer>
        );
    }

    // 데이터 없음 상태
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
                </SectionTitle>
            </ResultsPageContainer>
        );
    }

    // 에러 상태
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
            
            <RecommendationChips currentModel={currentUiModel} />
            
            {/* ✨ [신규] AI 요약 카드 (데이터가 있을 때만 표시) */}
            {searchSummary && (
                <TextSummaryCard>
                    <h3>AI 인사이트 요약</h3>
                    {searchSummary}
                </TextSummaryCard>
            )}
            
            {/* 차트 영역 */}
            {chartData.length > 0 && (
                <ChartContainer>
                    <ChartRow>
                        {chartData.map((chart, index) => {
                            if (chart.chart_type === 'crosstab') {
                                return (
                                    <StackedBarChart
                                        key={index}
                                        title={chart.title}
                                        data={chart.data}
                                    />
                                );
                            } else {
                                return (
                                    <CategoryPieChart
                                        key={index}
                                        title={chart.title}
                                        data={chart.data}
                                    />
                                );
                            }
                        })}
                    </ChartRow>
                </ChartContainer>
            )}
            
            {/* 테이블 영역 */}
            <TableCard>
                <SectionTitle>상세 데이터 Table</SectionTitle>
                <StyledTable>
                    <TableHead>
                        <tr>
                            <th>목록번호</th>
                            {orderedHeaders
                                .filter(key => key !== 'panel_id')
                                .map((key) => (
                                    <th key={key}>
                                        {KEY_TO_LABEL_MAP[key] || QPOLL_FIELD_LABEL_MAP[key] || key}
                                    </th>
                                ))}
                        </tr>
                        {/* 필터 입력 행 */}
                        <tr>
                            <th></th>
                            {orderedHeaders
                                .filter(key => key !== 'panel_id')
                                .map((key) => (
                                    <th key={`${key}-filter`}>
                                        <input
                                            type="text"
                                            placeholder="필터..."
                                            value={filters[key] || ''}
                                            onChange={(e) => handleFilterChange(e, key)}
                                            style={{ width: '100%', boxSizing: 'border-box', padding: '4px', borderRadius: '4px', border: '1px solid #ddd' }}
                                        />
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
                                    <StyledLink to={`/detail/${row.panel_id}`}>
                                        {startIndex + index + 1}
                                    </StyledLink>
                                </td>
                                {orderedHeaders
                                    .filter(key => key !== 'panel_id')
                                    .map((key) => {
                                        const value = row[key];
                                        let displayValue;
                                        const MAX_LENGTH = 30; 
                                        
                                        if (value == null || value === '' || value === '미응답') {
                                            displayValue = '-';
                                        } 
                                        else if (QPOLL_KEYS.includes(key)) { 
                                            displayValue = simplifyQpollValue(key, value);
                                        } 
                                        else { 
                                            if (Array.isArray(value)) {
                                                displayValue = value.length > 0 ? value.join(', ') : '-';
                                            } else if (typeof value === 'object') {
                                                displayValue = String(JSON.stringify(value));
                                            } else {
                                                displayValue = String(value);
                                            }

                                            if (displayValue.length > MAX_LENGTH) {
                                                displayValue = displayValue.substring(0, MAX_LENGTH) + '...';
                                            }
                                        }

                                        return (
                                            <td key={key} title={String(value)}>
                                                {displayValue}
                                            </td>
                                        );
                                    })}
                            </tr>
                        ))}
                    </TableBody>
                </StyledTable>
            </TableCard>
            
            {/* 페이지네이션 */}
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

export default ResultsPage;