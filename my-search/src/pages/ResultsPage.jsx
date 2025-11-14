import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CategoryPieChart from '../components/CategoryPieChart';
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
    
    // ✅ URL에서 한 번만 읽기 (ref로 저장)
    const queryRef = useRef(searchParams.get('q'));
    const modelRef = useRef(searchParams.get('model') || 'pro');
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [majorFields, setMajorFields] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    
    // ✅ 한 번만 실행되도록
    const hasFetched = useRef(false);

    useEffect(() => {
        const query = queryRef.current;
        const model = modelRef.current;
        
        console.log('=== Pro useEffect 실행 ===');
        console.log('query:', query);
        console.log('model:', model);
        console.log('hasFetched:', hasFetched.current);
        
        if (!query) {
            console.log('⚠️ query 없음');
            setIsLoading(false);
            return;
        }
        
        if (hasFetched.current) {
            console.log('✅ 이미 fetch 완료, 스킵');
            return;
        }
        
        const fetchData = async () => {
            console.log('🔄 Pro 모드 검색 시작');
            console.time("API 요청 + 데이터 처리");
            
            hasFetched.current = true;
            setIsLoading(true);
            setError(null);

            try {
                const url = 'http://localhost:8000/api/search-and-analyze';
                const body = { query: query, model: model };
                
                console.log('📤 POST', url);
                console.log('📤 Body:', JSON.stringify(body));
                
                const searchResponse = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                console.log('📥 Status:', searchResponse.status);

                if (!searchResponse.ok) {
                    throw new Error(`HTTP error! status: ${searchResponse.status}`);
                }

                const data1 = await searchResponse.json();
                console.log('✅ 응답 받음');
                
                const report = data1.charts || [];
                const transformedCharts = report.map(chart_raw => ({
                    title: chart_raw?.topic,
                    data: transformChartData(chart_raw?.chart_data[0]?.values) 
                }));
                setChartData(transformedCharts);
                
                const fields = (data1.display_fields || []).map(item => item.field);
                setMajorFields(fields);

                const fullTableData = data1.tableData || [];
                setTableData(fullTableData);
                
                console.log(`✅ ${fullTableData.length}개 결과 로드 완료`);
                
            } catch(e) {
                console.error('❌ 에러:', e);
                setError(e.message);
                hasFetched.current = false;
            } finally {
                setIsLoading(false);
                setCurrentPage(1);
                console.timeEnd("API 요청 + 데이터 처리");
            }
        };

        fetchData();
    }, []); // ✅ 빈 배열! 한 번만 실행

    const itemsPerPage = 10;
    const totalPages = Math.ceil(tableData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTableData = tableData.slice(startIndex, startIndex + itemsPerPage);
    
    const allKeys = tableData.length > 0 ? Object.keys(tableData[0]) : [];
    const otherKeys = allKeys.filter(key => 
        key !== 'panel_id' && !majorFields.includes(key)
    );
    const orderedHeaders = [...new Set([...majorFields, ...otherKeys])];
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handleRowClick = (panel_id) => {
        navigate(`/detail/${panel_id}`);
    };

    if (isLoading) {
        return (
            <ResultsPageContainer>
                <SearchBar 
                    defaultQuery={queryRef.current} 
                    defaultModel={modelRef.current} 
                />
                <LoadingIndicator
                    message="인사이트 도출중입니다. 잠시만 기다려주세요."
                />
            </ResultsPageContainer>
        );
    }

    if (tableData.length === 0 && !error) {
        return (
            <ResultsPageContainer>
                <SearchBar 
                    defaultQuery={queryRef.current} 
                    defaultModel={modelRef.current} 
                />
                <SectionTitle
                    style={{
                        marginTop: '60px',
                        textAlign: 'center',
                        color: '#6b7280'
                    }}
                >
                    '{queryRef.current}'에 대한 검색 결과가 없습니다.
                </SectionTitle>
            </ResultsPageContainer>
        );
    }

    if (error) {
        return (
            <ResultsPageContainer>
                <SearchBar 
                    defaultQuery={queryRef.current} 
                    defaultModel={modelRef.current} 
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
                defaultQuery={queryRef.current} 
                defaultModel={modelRef.current} 
            />
            <SummaryCard>
                <ChartRow>
                    {chartData.map((chart, index) => (
                        <CategoryPieChart
                            key={index}
                            title={chart.title}
                            data={chart.data}
                        />
                    ))}
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
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
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
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    {'>>'}
                </PageButton>
            </PaginationContainer>
        </ResultsPageContainer>
    );
};

export default ResultsPage;