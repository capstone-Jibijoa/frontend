import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams, Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar'; // 메인페이지 검색창 재사용
import CategoryPieChart from '../components/CategoryPieChart'; // 차트 컴포넌트 재사용

// 페이지 전체를 감싸는 컨테이너
const ResultsPageContainer = styled.div`
    width: 100%;
    max-width: 1440px;
    min-height: 100vh;
    margin: 0 auto;
    padding: 40px 80px;
    box-sizing: border-box;
    background-color: #f9fafb;

    display: flex;
    flex-direction: column;
    align-items: center;
`;

// 'AI 요약 정리' 섹션을 감싸는 흰색 카드
const SummaryCard = styled.section`
    background-color: #ffffff;
    border-radius: 16px;
    padding: 32px;
    margin-top: 40px;
    border: 1px solid #FBCFE8; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    width: 100%;
`;

// "AI 요약 정리", "Table" 등에 사용할 공통 섹션 제목
const SectionTitle = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: #111827; 
    margin-top: 0;
    margin-bottom: 24px;
`;

const ChartGridContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px; /* 차트 행(row) 사이의 간격 */
`;

const ChartRow = styled.div`
    display: flex;
    gap: 24px; /* 차트 사이의 간격 */
`;

// 테이블
const TableCard = styled.section`
    background-color: #ffffff;
    border-radius: 16px;
    padding: 32px;
    margin-top: 40px; /* AI 요약 카드와의 간격 */
    border: 1px solid #FBCFE8; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    width: 100%;
`;

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse; /* 테두리 선을 한 줄로 합침 */
    text-align: left; /* 기본 정렬은 왼쪽 */
`;

// 테이블 헤드
const TableHead = styled.thead`
    background-color: #f9fafb; /* 헤더 배경색 */
    
    th {
        font-size: 14px;
        font-weight: 600;
        color: #6b7280; /* 연한 회색 글씨 */
        padding: 12px 16px;
        border-bottom: 2px solid #e5e7eb;
    }
`;

// 테이블 바디
const TableBody = styled.tbody`
    tr {
        /* 한 줄씩 번갈아가며 배경색을 칠합니다 (zebra striping) */
        &:nth-child(even) {
        background-color: #f9fafb;
        }
    }

    td {
        font-size: 14px;
        color: #374151; /* 진한 회색 글씨 */
        padding: 12px 16px;
        border-bottom: 1px solid #e5e7eb;
    }
`;

const StyledLink = styled(Link)`
    color: #374151; /* 테이블 텍스트와 동일한 색상 */
    text-decoration: none; /* 밑줄 제거 */

    :hover {
    text-decoration: underline; /* 마우스 올리면 밑줄 표시 */
    color: #D466C9; /* 포인트 컬러 */
    }
`;

// 페이징 버튼을 감싸는 컨테이너
const PaginationContainer = styled.nav`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 32px;
    width: 100%;
`;

// "Previous", "Next", "1", "2", "3" 버튼
const PageButton = styled.button`
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid #FBCFE8;
    background-color: #ffffff;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    /* 마우스를 올렸을 때 효과 */
    &:hover {
        background-color: #f9fafb;
    }

    /* 'active' prop이 true일 때 적용될 스타일 */
    ${(props) =>
        props.active &&
        `
        background-color: #D466C9;
        border-color: #D466C9;
        color: #ffffff;
        font-weight: 700;
    `}

    /* 비활성화되었을 때 */
    &:disabled {
        color: #9ca3af;
        cursor: not-allowed;
        background-color: #f9fafb;
    }
`;

const ResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    // 로딩 상태를 저장
    const [isLoading, setIsLoading] = useState(true);
    // 에러 상태를 저장
    const [error, setError] = useState(null);
    // 백엔드에서 받아온 데이터를 저장
    const [chartData, setChartData] = useState({});
    const [tableData, setTableData] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => { // 검색어가 없으면 요청하지 않음
        if (!query) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true); // 로딩 시작
            setError(null);     // 이전 에러 초기화

            try {
                // ~~~ 부분을 실제 백엔드 주소로 바꾸기
                const response = await fetch(`~~~/search?q=${query}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // 우선 데이터 형식 가정 반드시 수정
                setChartData({
                    fruit: data.fruitData || [],
                    meat: data.meatData || [],
                    job: data.jobData || [],
                    age: data.ageData || [],
                    marriage: data.marriageData || []
                });
                setTableData(data.tableData || []);
            } catch(e) {
                console.error("Fetch error:", e);
                setError(e.message);
            } finally {
                setIsLoading(false); // 로딩 끝
                setCurrentPage(1); // 1페이지로 리셋
            }
        };

        fetchData();
    }, [query]);

    const itemsPerPage = 5;
    // 총 아이템을 5로 나눈 값을 올림
    const totalPages = Math.ceil(tableData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage; // 시작 인덱스
    const currentTableData = tableData.slice(startIndex, startIndex + itemsPerPage);
    // 1페이지부터 마지막페이지까지 담는 배열
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    if (isLoading) {
        return (
        <ResultsPageContainer>
            <SearchBar defaultQuery={query} />
            <SectionTitle style={{ marginTop: '40px', color: 'red' }}>
            "{query}"에 대한 검색 결과를 불러오는 중...
            </SectionTitle>
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
        </ResultsPageContainer>
        );
    }
    return (
        <ResultsPageContainer>
            <SearchBar defaultQuery={query} />

            <SummaryCard>
                <SectionTitle>AI 요약 정리</SectionTitle>

                <ChartGridContainer>
                    {/* 첫 번째 행: 차트 2개 */}
                    <ChartRow>
                        <CategoryPieChart title="Fruit" data={chartData.fruitData} />
                        <CategoryPieChart title="meat" data={chartData.meatData} isDoughnut={true} />
                    </ChartRow>

                    {/* 두 번째 행: 차트 3개 */}
                    <ChartRow>
                        <CategoryPieChart title="직업" data={chartData.jobData} />
                        <CategoryPieChart title="나이" data={chartData.ageData} />
                        <CategoryPieChart title="결혼" data={chartData.marriageData} />
                    </ChartRow>
                </ChartGridContainer>

            </SummaryCard>
            <TableCard>
                <SectionTitle>Table</SectionTitle>
                <StyledTable>
                    <TableHead>
                        <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Job</th>
                        <th>Married</th>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {/* tableData를 map으로 돌려 행을 만듧*/}
                        {currentTableData.map((row) => (
                        <tr key={row.id}>
                            <td>
                                <StyledLink to={`/detail/${row.id}`}>{row.id}
                                </StyledLink>
                            </td>
                            <td>{row.name}</td>
                            <td>{row.age}</td>
                            <td>{row.job}</td>
                            <td>{row.married}</td>
                        </tr>
                        ))}
                    </TableBody>
                </StyledTable>
            </TableCard>
            <PaginationContainer>
                <PageButton>{'<<'}</PageButton>
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
                <PageButton>{'>>'}</PageButton>
            </PaginationContainer>
        </ResultsPageContainer>
    ); 
};

export default ResultsPage;