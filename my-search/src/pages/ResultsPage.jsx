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

// 임시로 사용할 샘플 데이터
const createMockSearchData = (query) => {
    let major_fields = ["birth_year", "region"];
    let dynamicCharts = [
        {
            "topic": `"${query}" 연령대 분석`,
            "chart_data": [ { "values": { "20대": 10, "30대": 20, "40대": 30, "50대": 20, "60대": 10}}]
        },
        { 
            "topic": `"${query}" 연관 주제 (결혼)`, 
            "chart_data": [ { "values": { "기혼": 60, "미혼": 40 } } ] 
        },
        { 
            "topic": "주요 직업", 
            "chart_data": [ { "values": { "전문직": 33, "사무직": 34, "일용직": 33} } ] 
        }
    ]; // (차트 데이터...)
    if (query.includes("서울")) {
        dynamicCharts.push({
            "topic": "서울 거주자 소득",
            "chart_data": [ { "values": { "500이상": 80, "500미만": 20 } } ]
        });
    }
    if (query.includes("차량")) {
        major_fields = ["car_ownership", "job_title_raw"];
    }

    return {
        "analysis_report": dynamicCharts,
        "major_fields": major_fields, // 
        "results": [ // 
        { "uid": 1001 },
        { "uid": 1002 },
        { "uid": 1003 },
        { "uid": 1004 },
        { "uid": 1005 },
        { "uid": 1006 }
        ]
    };
};

const createMockDetailData = (uid) => {
    return {
        "uid": uid,
        "birth_year": 1990 + (uid % 5), // 
        "region": (uid % 2 === 0) ? "서울" : "경기",
        "job_title_raw": (uid % 2 === 0) ? "개발자" : "디자이너",
        "car_ownership": (uid % 3 === 0) ? "보유" : "없음",
        "marital_status": "기혼"
    };
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
        /* 실제 사용할 것임
        const fetchData = async () => {
            setIsLoading(true); // 로딩 시작
            setError(null);     // 이전 에러 초기화

            try {
                // 실제 AWS 서버주소로 변경
                const searchResponse = await fetch(`[AWS 서버 주소]/api/search`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: query })
                });

                if (!searchResponse.ok) {
                    throw new Error(`HTTP eror! status: ${response.status}`);
                }

                const data1 = await searchResponse.json();
                const report = data1.analysis_report;
                const transformedCharts = report.map(chart_raw => ({
                    title: chart_raw?.topic,
                    data: transformChartData(chart_raw?.chart_data[0]?.values) 
                }));
                setChartData(transformedCharts);
                
                // 주요 필드와 uid 저장
                const uids = data1.results.map(row => row.uid);
                setMajorFields(data1.major_fields || []);

                // 2차 요청(uid 개수만큼 요청)
                const detailPromises = uids.map(uid => 
                    fetch(`[AWS 서버 주소]/api/detail/${uid}`).then(res => res.json())    
                );

                const fullTableData = await Promise.all(detailPromises);

                // 최종 데이터 저장

                setTableData(fullTableData);
            } catch(e) {
                setError(e.message);
            } finally {
                setIsLoading(false); // 로딩 끝
                setCurrentPage(1); // 1페이지로 리셋
            }
        };

        fetchData();
        */

        // 실험용 Fetch(서버와 연결되면 삭제)
        const simulateFetch = async () => { // 
            setIsLoading(true);
            setError(null);
            try {
                // 1. 1차 요청 시뮬레이션
                await new Promise(res => setTimeout(res, 500)); // 
                const data1 = createMockSearchData(query);
                
                const report = data1.analysis_report;
                const transformedCharts = report.map(chart_raw => ({
                title: chart_raw?.topic,
                data: transformChartData(chart_raw?.chart_data[0]?.values),
                isDoughnut: false
                }));
                setChartData(transformedCharts);

                // 1-2. '주요 필드'와 'UID 목록' 저장
                const uids = data1.results.map(row => row.uid); 
                setMajorFields(data1.major_fields || []);

                // 2. 2차 요청 시뮬레이션
                await new Promise(res => setTimeout(res, 500)); // 
                const fullTableData = uids.map(uid => createMockDetailData(uid));
                
                // 3. 최종 데이터 저장
                setTableData(fullTableData);

            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
                setCurrentPage(1);
            }
        };
        simulateFetch();

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
        key !== 'uid' && !majorFields.includes(key)
    );
    const orderedHeaders = [...majorFields, ...otherKeys];
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    if (isLoading) {
        return (
        <ResultsPageContainer>
            <SearchBar defaultQuery={query} />
            <LoadingIndicator 
                message={`"${query}"에 대한 검색 결과를 불러오는 중...`} 
            />
        </ResultsPageContainer>
        );
    }

    if (error) {
    return (
        <ResultsPageContainer>
            <SearchBar defaultQuery={query} />
            <SectionTitle style={{ marginTop: '40px', color: 'red' }}>
            데이터 로드 실패: {error}
            </SectionTitle>

            {/* 임시로 사용할 DetailPage로 넘어가는 버튼 */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p>상세페이지 연결</p>
            <Link to="/detail/A1-Test" style={{ textDecoration: 'none' }}>
                <PageButton>임시 상세 페이지로 이동</PageButton>
            </Link>
            </div>
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
                            .filter(key => key !== 'uid')
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
                        <tr key={row.uid || index}>
                            <td>
                                <StyledLink to={`/detail/${row.uid}`}>
                                    {startIndex + index + 1}
                                </StyledLink>
                            </td>

                            {orderedHeaders.filter(key => key !== 'uid')
                            .slice(0, 4)
                            .map((key) => {
                                const value = row[key];
                                return (
                                    <td key={key}>
                                        {String(value)}
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
                        active={currentPage === pageNumber}
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