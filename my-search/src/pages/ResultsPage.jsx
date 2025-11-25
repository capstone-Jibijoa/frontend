import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HomeButton from '../components/HomeButton';
import CategoryPieChart from '../components/CategoryPieChart';
import StackedBarChart from '../components/StackedBarChart';
import LoadingIndicator from '../components/LoadingIndicator';
import RecommendationChips from '../components/RecommendationChips'; // ✨ import 추가
import { useSearchResults } from '../contexts/SearchResultContext';
import { 
    KEY_TO_LABEL_MAP, 
    QPOLL_FIELD_LABEL_MAP, 
    QPOLL_KEYS, 
    simplifyQpollValue 
} from '../utils/constants';
import { 
    ResultsPageContainer, 
    SummaryCard, 
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
    
    const query = searchParams.get('q');
    // 실제 데이터 로딩에 쓰이는 모델 (URL 기준)
    const urlModel = searchParams.get('model') || 'pro';
    
    // ✨ UI 동기화용 state (초기값은 URL 모델)
    const [currentUiModel, setCurrentUiModel] = useState(urlModel);

    const { resultsState, setResultsState } = useSearchResults();
    const {
        isLoading,
        error,
        chartData,
        tableData,
        majorFields,
        lastLoadedQuery
    } = resultsState;
    
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({});

    // URL이 바뀌면(뒤로가기 등) UI 모델 상태도 동기화
    useEffect(() => {
        setCurrentUiModel(urlModel);
    }, [urlModel]);
    
    useEffect(() => {
        // 데이터 페칭 로직은 urlModel 기준
        if (query && query === lastLoadedQuery && urlModel === resultsState.model) {
            console.log('이전 검색 결과가 유효하여 API 호출을 건너뜁니다.');
            setResultsState(prev => ({ ...prev, isLoading: false, error: null }));
            return;
        }

        if (!query) {
            setResultsState({
                query: '', model: 'pro', tableData: [], chartData: [], 
                majorFields: [], lastLoadedQuery: '', isLoading: false, error: null 
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
                model: urlModel
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
                
                setResultsState(prev => ({
                    ...prev,
                    chartData: transformedCharts, 
                    tableData: fullTableData,      
                    majorFields: fields,           
                    lastLoadedQuery: query, 
                    isLoading: false,
                    error: null,
                    model: urlModel 
                }));

                setCurrentPage(1);
                
            } catch(e) {
                console.error('에러:', e);
                setResultsState(prev => ({ 
                    ...prev, 
                    error: e.message, 
                    isLoading: false, 
                    tableData: [], 
                    chartData: [] 
                }));
            } finally {
                console.timeEnd("API 요청 + 데이터 처리");
            }
        };

        fetchData();
    }, [query, urlModel, lastLoadedQuery]);

    const handleFilterChange = (e, key) => {
        setFilters(prev => ({ ...prev, [key]: e.target.value }));
        setCurrentPage(1);
    };

    const filteredData = tableData.filter(row => {
        return Object.keys(filters).every(key => {
            const filterValue = filters[key];
            if (!filterValue) return true;

            const rowValue = row[key];
            if (rowValue == null) return false;

            return String(rowValue).toLowerCase().includes(filterValue.toLowerCase());
        });
    });

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTableData = filteredData.slice(startIndex, startIndex + itemsPerPage);
    
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

    // 헤더 렌더링
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
                <LoadingIndicator
                    message="인사이트를 도출하고 있습니다. 잠시만 기다려 주세요."
                />
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
            
            {/* ✨ 추천 검색어 칩 추가 (현재 UI 모델 전달) */}
            <RecommendationChips currentModel={currentUiModel} />
            
            <SummaryCard>
                <ChartRow>
                    {chartData.map((chart, index) => {
                        const chartValues = chart.data;

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
            </SummaryCard>
            
            <TableCard>
                <SectionTitle>Table</SectionTitle>
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
                                            style={{ width: '100%', boxSizing: 'border-box' }}/>
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
                                            displayValue = '미응답';
                                        } 
                                        else if (QPOLL_KEYS.includes(key)) { 
                                            displayValue = simplifyQpollValue(key, value);
                                        } 
                                        else { 
                                            if (Array.isArray(value)) {
                                                displayValue = value.length > 0 ? value.join(', ') : '미응답';
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

export default ResultsPage;