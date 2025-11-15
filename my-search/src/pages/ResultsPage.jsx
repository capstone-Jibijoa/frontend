import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CategoryPieChart from '../components/CategoryPieChart';
import StackedBarChart from '../components/StackedBarChart';
import LoadingIndicator from '../components/LoadingIndicator';
import { KEY_TO_LABEL_MAP } from '../utils/constants';
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
                console.timeEnd("API 요청 + 데이터 처리");
            }
        };

        fetchData();
    }, [query, model]);

    const itemsPerPage = 10;
    const totalPages = Math.ceil(tableData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTableData = tableData.slice(startIndex, startIndex + itemsPerPage);
    
    const allKeys = tableData.length > 0 ? Object.keys(tableData[0]) : [];
    const otherKeys = allKeys.filter(key => 
        key !== 'panel_id' && !majorFields.includes(key)
    );
    const orderedHeaders = [...new Set([...majorFields, ...otherKeys])];
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
                                .slice(0, 4)
                                .map((key) => (
                                    <th key={key}>
                                        {KEY_TO_LABEL_MAP[key] || key}
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
                                    .slice(0, 4)
                                    .map((key) => {
                                        const value = row[key];
                                        let displayValue;
                                        
                                        if (value == null || value === '') {
                                            displayValue = '미응답';
                                        } else if (Array.isArray(value)) {
                                            displayValue = value.length > 0 ? value.join(', ') : '미응답';
                                        } else if (typeof value === 'object') {
                                            displayValue = '[데이터]';
                                        } else {
                                            displayValue = String(value);
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