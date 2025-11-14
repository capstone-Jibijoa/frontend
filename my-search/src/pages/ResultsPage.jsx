import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams, Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar'; // 메인페이지 검색창 재사용
import CategoryPieChart from '../components/CategoryPieChart'; // 차트 컴포넌트 재사용
import LoadingIndicator from '../components/LoadingIndicator';
import { KEY_TO_LABEL_MAP } from '../utils/constants'; // 사전
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

// 백엔드 데이터를 차트 형식으로 변환
const transformChartData = (chartValuesObject) => {
    if (!chartValuesObject) return [];

    return Object.entries(chartValuesObject).map(([name, value]) => ({
        name: name,
        value: value
    }));
};

const ResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    // 로딩 상태를 저장
    const [isLoading, setIsLoading] = useState(true);
    // 에러 상태를 저장
    const [error, setError] = useState(null);
    // 백엔드에서 받아온 데이터를 저장
    const [chartData, setChartData] = useState([]);
    const [tableData, setTableData] = useState([]);
    // 주요 필드를 저장할 state
    const [majorFields, setMajorFields] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => { // 검색어가 없으면 요청하지 않음
        if (!query) {
            setIsLoading(false);
            return;
        }
        
        const fetchData = async () => {
            console.time("API 요청 + 데이터 처리");
            setIsLoading(true); // 로딩 시작
            setError(null);     // 이전 에러 초기화

            try {
                const searchResponse = await fetch(`http://localhost:8000/api/search-and-analyze`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: query })
                });

                const endTime = performance.now();
                const duration = endTime - startTime;
                console.log(`⏱️ API 응답 시간: ${duration.toFixed(2)}ms`);

                if (!searchResponse.ok) {
                    throw new Error(`HTTP error! status: ${searchResponse.status}`);
                }

                const data1 = await searchResponse.json();
                const report = data1.charts || [];
                const transformedCharts = report.map(chart_raw => ({
                    title: chart_raw?.topic,
                    data: transformChartData(chart_raw?.chart_data[0]?.values) 
                }));
                setChartData(transformedCharts);
                
                // 주요 필드와 panel_id 저장
                const fields = (data1.display_fields || []).map(item => item.field);
                setMajorFields(fields);

                const fullTableData = data1.tableData || [];

                console.log("--- 디버깅 ---");
                console.log("LLM이 정한 주요 필드 (majorFields):", fields);
                if (fullTableData.length > 0) {
                    console.log("DB에서 실제 받은 패널 데이터 (tableData[0]):", fullTableData[0]);
                    console.log("DB 데이터의 모든 Key 목록:", Object.keys(fullTableData[0]));
                }
                console.log("--------------");
                // 최종 데이터 저장

                setTableData(fullTableData);
            } catch(e) {
                setError(e.message);
            } finally {

                setIsLoading(false); // 로딩 끝
                setCurrentPage(1); // 1페이지로 리셋

                console.timeEnd("API 요청 + 데이터 처리");
            }
        };

        fetchData();
    }, [query]);

    const itemsPerPage = 5;
    // 총 아이템을 5로 나눈 값을 올림
    const totalPages = Math.ceil(tableData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage; // 시작 인덱스
    const currentTableData = tableData.slice(startIndex, startIndex + itemsPerPage);
    // 모든 키
    const allKeys = tableData.length > 0 ? Object.keys(tableData[0]) : [];
    // 기타 키
    const otherKeys = allKeys.filter(key => 
        key !== 'panel_id' && !majorFields.includes(key)
    );
    const orderedHeaders = [...new Set([...majorFields, ...otherKeys])];
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    if (isLoading) {
        return (
        <ResultsPageContainer>
            <SearchBar defaultQuery={query} />
            <LoadingIndicator 
                message={`검색 결과를 불러오는 중...`} 
            />
        </ResultsPageContainer>
        );
    }

    if (tableData.length ===0) {
        return (
            <ResultsPageContainer>
            <SearchBar defaultQuery={query} />
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
        )
    }

    if (error) {
    return (
        <ResultsPageContainer>
            <SearchBar defaultQuery={query} />
            <SectionTitle style={{ marginTop: '40px', color: 'red' }}>
            데이터 로드 실패: {error}
            </SectionTitle>
        </ResultsPageContainer>
        );
    }
    return (
        <ResultsPageContainer>
            <SearchBar defaultQuery={query} />
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
                        {/* tableData를 map으로 돌려 행을 만듦*/}
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

                            {orderedHeaders.filter(key => key !== 'panel_id')
                            .slice(0, 4)
                            .map((key) => {
                                const value = row[key];
                                let displayValue;
                                
                                if (value == null || value === '') {
                                    displayValue = '미응답';
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
                    disabled={currentPage ===1}
                >
                    {'<<'}
                </PageButton>
                <PageButton 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(currentPage - 1)}>{'<'}
                </PageButton>
                {/* map을 통해 페이지 번호 동적 생성*/}
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