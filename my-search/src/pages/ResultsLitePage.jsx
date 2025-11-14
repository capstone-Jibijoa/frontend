import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import LoadingIndicator from '../components/LoadingIndicator';
import { KEY_TO_LABEL_MAP } from '../utils/constants';
import { 
    ResultsPageContainer, 
    SectionTitle, 
    TableCard, 
    StyledTable, 
    TableHead, 
    TableBody, 
    StyledLink,
    PaginationContainer,
    PageButton    
} from '../style/ResultPage.styles';

const ResultsLitePage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const queryRef = useRef(searchParams.get('q'));
    const modelRef = useRef(searchParams.get('model') || 'lite');
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [majorFields, setMajorFields] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    
    const hasFetched = useRef(false);

    useEffect(() => {
        const query = queryRef.current;
        const model = modelRef.current;
        
        console.log('=== Lite useEffect 실행 ===');
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
            console.log('🔄 Lite 모드 검색 시작');
            console.time("Lite 모드 검색");
            
            hasFetched.current = true;
            setIsLoading(true);
            setError(null);

            try {
                const url = 'http://localhost:8000/api/search';
                const body = { query: query };
                
                console.log('📤 POST', url);
                
                const searchResponse = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                console.log('📥 Status:', searchResponse.status);

                if (!searchResponse.ok) {
                    throw new Error(`HTTP error! status: ${searchResponse.status}`);
                }

                const data = await searchResponse.json();
                console.log('✅ 응답 받음');
                
                // ✅ 응답 구조 전체 출력
                console.log('📦 === 응답 데이터 전체 (Lite) ===');
                // console.log(JSON.stringify(data, null, 2)); // 디버깅 시 너무 길어질 수 있으므로 주석 처리
                
                // ✅ 데이터 설정
                // ⭐️ [수정] display_fields 구조에 맞게 field 이름만 추출
                const fields = (data.display_fields || []).map(item => {
                    // item이 객체인 경우 item.field를 사용하고, 아니면 item 자체를 사용 (안전성 보강)
                    return item.field || item;
                });
                console.log('✅ 추출된 필드:', fields);
                setMajorFields(fields);
                
                const fullTableData = data.tableData || [];
                console.log('✅ 설정할 테이블 데이터 길이:', fullTableData.length);
                setTableData(fullTableData);
                
                console.log(`✅ ${fullTableData.length}개 결과 로드 완료`);
                
            } catch(e) {
                console.error('❌ Lite 모드 오류:', e);
                setError(e.message);
                hasFetched.current = false;
            } finally {
                setIsLoading(false);
                setCurrentPage(1);
                console.timeEnd("Lite 모드 검색");
            }
        };

        fetchData();
    }, []);

    const itemsPerPage = 10;
    const totalPages = Math.ceil(tableData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTableData = tableData.slice(startIndex, startIndex + itemsPerPage);
    
    // ⭐️ [수정] orderedHeaders 생성 로직 유지 (tableData의 키를 기준으로 순서 결정)
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
                <LoadingIndicator message="빠른 검색 중..." />
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
            
            <SectionTitle style={{ marginTop: '40px', fontSize: '18px', color: '#6b7280' }}>
                🚀 Lite 모드 - 총 {tableData.length}개 결과
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

export default ResultsLitePage;