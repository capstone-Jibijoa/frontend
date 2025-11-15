import React, { useState, useEffect } from 'react'; 
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import LoadingIndicator from '../components/LoadingIndicator';
import { getFieldLabel } from '../utils/constants';
import { 
    PageContainer, 
    DetailCard, 
    InfoGrid, 
    InfoItem, 
    InfoKey, 
    InfoValue, 
    BackButton 
} from '../style/DetailPage.styles';

// DetailPage 컴포넌트
const DetailPage = () => {
    const { panel_id } = useParams();
    const navigate = useNavigate();

    // 데이터를 위한 state
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [detailData, setDetailData] = useState({});
    
    useEffect(() => {
        const fetchDataForId = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://localhost:8000/api/panels/${panel_id}`); 
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                // 백엔드에서 데이터 주는 방식 확인
                setDetailData(data.detail || data || {});
            } catch (e) {
                console.error("Fetch error:", e);
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDataForId();
    }, [panel_id]);
    
    if (isLoading) {
        return (
            <PageContainer>
                <SearchBar width="100%" maxWidth="100%" />
                <LoadingIndicator 
                    message={`상세 정보를 불러오는 중...`} 
                />
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <SearchBar width="100%" maxWidth="100%" />
                <h2 style={{ marginTop: '40px', color: 'red' }}>
                    데이터 로드 실패: {error}
                </h2>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <SearchBar />
            <DetailCard>
                <InfoGrid>
                    {Object.entries(detailData)
                        .filter(([key]) => {
                            // 제외할 필드
                            const excludeFields = [
                                'panel_id',
                                'subjective_vector',  // 벡터 데이터
                                'qpoll_조회_오류'     // 에러 메시지 (필요시 표시)
                            ];
                            return !excludeFields.includes(key);
                        })
                        .map(([key, value]) => {
                            // 통합 라벨 함수 사용 (Welcome + QPoll)
                            const label = getFieldLabel(key);

                            if (!label) {
                                // 라벨이 없는 키는 표시 안 함
                                return null;
                            }

                            // 값 처리
                            let displayValue;
                            
                            if (value == null || value === '') {
                                displayValue = '미응답';
                            } 
                            // [수정] 빈 배열([])인 경우를 명시적으로 처리
                            else if (Array.isArray(value) && value.length === 0) {
                                displayValue = '미응답';
                            }
                            // [기존 로직] 배열이면서 내용이 있는 경우
                            else if (Array.isArray(value)) {
                                // 내용이 있는 배열은 Join하여 출력
                                displayValue = value.join(', ');
                            }
                            // [기존 로직] 객체인 경우 (또는 다른 타입 객체)
                            else if (typeof value === 'object') {
                                displayValue = JSON.stringify(value);
                            } else {
                                displayValue = String(value);
                            }

                            return (
                                <InfoItem key={key}>
                                    <InfoKey>{label}</InfoKey>
                                    <InfoValue>{displayValue}</InfoValue>
                                </InfoItem>
                            );
                        })}
                </InfoGrid>
            </DetailCard>
            <BackButton onClick={() => navigate(-1)}>돌아가기</BackButton>
        </PageContainer>
    );
};

export default DetailPage;