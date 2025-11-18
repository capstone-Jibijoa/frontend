import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CategoryPieChart from '../components/CategoryPieChart';
import StackedBarChart from '../components/StackedBarChart';
import LoadingIndicator from '../components/LoadingIndicator';
import { 
    KEY_TO_LABEL_MAP, 
    QPOLL_FIELD_LABEL_MAP, // 헤더 라벨링용 Q-Poll 맵 (새로 추가)
    QPOLL_KEYS,             // 값 가공 식별용 Q-Poll 키 리스트 (새로 추가)
    simplifyQpollValue      // 값 가공 헬퍼 함수 (새로 추가)
} from '../utils/constants';
import { 
    ResultsPageContainer, 
    SummaryCard, 
    SectionTitle, 
    ChartTitle, 
    ChartRow, 
    TableCard, 
    StyledTable, 
    TableHead, 
    TableBody, 
    StyledLink,
    PaginationContainer,
    PageButton    
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
    const model = searchParams.get('model') || 'pro';
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [majorFields, setMajorFields] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({}); // 필터 상태 추가
    
    useEffect(() => {
        if (!query) {
            console.log('query 없음');
            setIsLoading(false);
            setTableData([]);
            setChartData([]);
            return;
        }
        
        const fetchData = async () => {
            console.log('Pro 모드 검색 시작');
            console.time("API 요청 + 데이터 처리");
            
            setIsLoading(true);
            setError(null);

            try {
                const url = 'http://localhost:8000/api/search-and-analyze';
                const body = { query: query, model: model };
                
                console.log('POST', url);
                console.log('Body:', JSON.stringify(body));
                
                const searchResponse = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                console.log('Status:', searchResponse.status);

                if (!searchResponse.ok) {
                    throw new Error(`HTTP error! status: ${searchResponse.status}`);
                }

                const data1 = await searchResponse.json();
                console.log('응답 받음');
                
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
    
                setChartData(transformedCharts);
                
                const fields = (data1.display_fields || []).map(item => item.field);
                setMajorFields(fields);

                const fullTableData = data1.tableData || [];
                setTableData(fullTableData);
                
                console.log(`${fullTableData.length}개 결과 로드 완료`);
                
            } catch(e) {
                console.error('에러:', e);
                setError(e.message);
            } finally {
                setIsLoading(false);
                setCurrentPage(1);
                setFilters({}); // 새 검색 시 필터 초기화
                console.timeEnd("API 요청 + 데이터 처리");
            }
        };

        fetchData();
    }, [query, model]);

    const handleFilterChange = (e, key) => {
        setFilters(prev => ({ ...prev, [key]: e.target.value }));
        setCurrentPage(1); // 필터 변경 시 1페이지로 이동
    };

    // 필터링 로직 적용
    const filteredData = tableData.filter(row => {
        return Object.keys(filters).every(key => {
            const filterValue = filters[key];
            if (!filterValue) return true; // 해당 키에 필터 값이 없으면 통과

            const rowValue = row[key];
            if (rowValue == null) return false; // 행에 값이 없으면 필터링(제외)

            // 대소문자 구분 없이 필터링
            return String(rowValue).toLowerCase().includes(filterValue.toLowerCase());
        });
    });

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTableData = filteredData.slice(startIndex, startIndex + itemsPerPage);
    
    const orderedHeaders = [...majorFields]; // 이 부분은 이전 제안을 유지합니다.
    const pagesPerBlock = 10; // 한 블록에 표시할 페이지 수
    const currentBlock = Math.ceil(currentPage / pagesPerBlock); // 현재 페이지가 속한 블록
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

    if (isLoading) {
        return (
            <ResultsPageContainer>
                <SearchBar 
                    defaultQuery={query} 
                    defaultModel={model} 
                />
                <LoadingIndicator
                    message="인사이트를 도출하고 있습니다. 잠시만 기다려 주세요."
                />
            </ResultsPageContainer>
        );
    }

    if (tableData.length === 0 && !error) {
        return (
            <ResultsPageContainer>
                <SearchBar 
                    defaultQuery={query} 
                    defaultModel={model} 
                />
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
                <SearchBar 
                    defaultQuery={query} 
                    defaultModel={model} 
                />
                <SectionTitle style={{ marginTop: '40px', color: 'red' }}>
                    데이터 로드 실패: {error}
                </SectionTitle>
            </ResultsPageContainer>
        );
    }

    return (
        <ResultsPageContainer>
            <SearchBar 
                defaultQuery={query} 
                defaultModel={model} 
            />
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
                                        {/* Welcome 필드가 아니면 QPoll 맵에서 라벨을 가져옵니다. */}
                                        {KEY_TO_LABEL_MAP[key] || QPOLL_FIELD_LABEL_MAP[key] || key}
                                    </th>
                                ))}
                        </tr>
                        {/* 필터 입력 행 추가 */}
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
                                        const MAX_LENGTH = 30; // 축약 기준 길이
                                        if (value == null || value === '' || value === '미응답') {
                                            displayValue = '미응답';
                                        } 
                                        // Q-Poll 필드: simplifyQpollValue 함수가 값 가공 및 길이 처리를 전담
                                        else if (QPOLL_KEYS.includes(key)) { 
                                            displayValue = simplifyQpollValue(key, value);
                                        } 
                                        // Welcome 필드 처리 (Array, Object, String)
                                        else { 
                                            if (Array.isArray(value)) {
                                                // 배열 (예: drinking_experience)을 문자열로 합침
                                                displayValue = value.length > 0 ? value.join(', ') : '미응답';
                                            } else if (typeof value === 'object') {
                                                // 객체 (JSONB 등)는 문자열로 변환
                                                displayValue = String(JSON.stringify(value));
                                            } else {
                                                // 일반 문자열 (출생연도, 성별 등)
                                                displayValue = String(value);
                                            }

                                            // [핵심 수정]: Welcome 필드 최종 출력 값의 길이가 30자를 초과하면 축약
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