import React, { useState, useEffect } from 'react'; 
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import LoadingIndicator from '../components/LoadingIndicator';
import { KEY_TO_LABEL_MAP } from '../utils/constants'; // 사전
import { PageContainer, DetailCard, InfoGrid, InfoItem, InfoKey, InfoValue, BackButton } from '../style/DetailPage.styles';


// 샘플 데이터
const createMockDetailData = (id) => {
  // 1001번 '가짜' 데이터
    if (id === "1001") {
        return {
        "uid": id,
        "marital_status": "기혼",
        "children_count": "2",
        "job_title_raw": "Developer",
        "birth_year": "1990",
        };
    }
    // 1002번 '가짜' 데이터 (키가 다름)
    if (id === "1002") {
        return {
        "uid": id,
        "marital_status": "미혼",
        "car_ownership": "보유",
        "phone_brand": "Apple",
        "birth_year": "1988",
        "region": "경기"
        };
    }
    // 기본 '가짜' 데이터
    return {
        "uid": id,
        "gender": "M",
        "education_level": "대학교 졸업",
        "job_duty": "의료"
    };
};
// DetailPage 컴포넌트
const DetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 데이터를 위한 state
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [detailData, setDetailData] = useState({});
    
    useEffect(() => {
        /* 실제 사용할 코드(우선은 주석처리)
        const fetchDataForId = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // AWS 서버 주소 변경해야함
                const response = await fetch(`[AWS 서버 주소]/api/detail/${id}`); 
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
        */
        // 시뮬레이션 코드
        const simulateFetch = () => {
            setIsLoading(true);
            setError(null);
            setTimeout(() => {
                try {
                // ID에 따라 다른 '가짜' 데이터를 가져옵니다.
                const mockData = createMockDetailData(id);
                setDetailData(mockData);
                setIsLoading(false);
                } catch (e) {
                setError(e.message);
                setIsLoading(false);
                }
            }, 1000);
        };
        simulateFetch();
    }, [id]);
    
    
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
                    {Object.entries(detailData).map(([key, value]) => {
                        // 사전에서 한글 제목 찾기
                        const label = KEY_TO_LABEL_MAP[key];

                        if (key === 'uid' || !label) {
                            return null;
                        }

                        // 사전에 있는 키만 그리드로 만든다.
                        return (
                            <InfoItem key={key}>
                                <InfoKey>{label}</InfoKey>
                                <InfoValue>{String(value)}</InfoValue>
                            </InfoItem>
                        );
                    })}
                </InfoGrid>
            </DetailCard>
            <BackButton onClick={() => navigate(-1)}>돌아가기</BackButton>
        </PageContainer>
    )
};

export default DetailPage;