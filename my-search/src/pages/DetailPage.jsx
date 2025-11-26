import React, { useState, useEffect } from 'react'; 
import styled from 'styled-components';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HomeButton from '../components/HomeButton';
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

// 중앙 정렬 및 아이템 간격 설정
const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px;
    margin-top: 30px; /* 상단 여백은 컨테이너에서 처리 */

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const DetailPage = () => {
    const { panel_id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [detailData, setDetailData] = useState({});
    
    useEffect(() => {
        const fetchDataForId = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
                console.log('📍 Using:', API_BASE_URL);
                const url = `${API_BASE_URL}/api/search`;
                const response = await fetch(`${url}/api/panels/${panel_id}`); 
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
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
    
    // 헤더 렌더링: HomeButton을 왼쪽으로, SearchBar 마진 제거
    const renderHeader = () => (
        <HeaderRow>
            <HomeButton />
            <SearchBar 
                width="100%" 
                maxWidth="100%" 
                marginTop="0px" // SearchBar 자체 여백 제거
            />
        </HeaderRow>
    );

    if (isLoading) {
        return (
            <PageContainer>
                {renderHeader()}
                <LoadingIndicator 
                    message={`상세 정보를 불러오는 중...`} 
                />
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                {renderHeader()}
                <h2 style={{ marginTop: '40px', color: 'red' }}>
                    데이터 로드 실패: {error}
                </h2>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            {renderHeader()}
            <DetailCard>
                <InfoGrid>
                    {Object.entries(detailData)
                        .filter(([key]) => {
                            const excludeFields = [
                                'panel_id',
                                'subjective_vector',
                                'qpoll_조회_오류'
                            ];
                            return !excludeFields.includes(key);
                        })
                        .map(([key, value]) => {
                            const label = getFieldLabel(key);

                            if (!label) {
                                return null;
                            }

                            let displayValue;
                            
                            if (value == null || value === '') {
                                displayValue = '미응답';
                            } 
                            else if (Array.isArray(value) && value.length === 0) {
                                displayValue = '미응답';
                            }
                            else if (Array.isArray(value)) {
                                displayValue = value.join(', ');
                            }
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