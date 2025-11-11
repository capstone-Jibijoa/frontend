import React from 'react';
import styled from 'styled-components';
// assets 폴더에서 이미지를 import
import dashboardMockup from '../assets/dashboard.png';

const DashboardContainer = styled.section`
  width: 600px;
  max-width: 1010px;
  margin-top: 70px;
  margin-bottom: 160px;
`;

// img 태그에 직접 스타일을 적용
const DashboardImage = styled.img`
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      {/* src에 import한 이미지를 연결 */}
      <DashboardImage src={dashboardMockup} alt="Project Dashboard Mockup" />
    </DashboardContainer>
  );
};

export default Dashboard;