import React from 'react';
import styled from 'styled-components';
// 1. assets 폴더에서 이미지를 import 합니다.
import dashboardMockup from '../assets/dashboard.png';

const DashboardContainer = styled.section`
  width: 100%;
  max-width: 1010px;
  margin-top: 80px; /* 간격 살짝 조정 */
  margin-bottom: 100px;
`;

// 2. img 태그에 직접 스타일을 적용합니다.
const DashboardImage = styled.img`
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      {/* 3. src에 import한 이미지를 연결합니다. */}
      <DashboardImage src={dashboardMockup} alt="Project Dashboard Mockup" />
    </DashboardContainer>
  );
};

export default Dashboard;