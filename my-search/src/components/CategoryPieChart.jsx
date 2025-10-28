import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// 차트 하나하나를 감싸는 박스 (ResultsPage에서 가져옴)
const ChartBox = styled.div`
    flex: 1;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    background-color: #ffffff;
    min-width: 200px; /* 차트가 너무 찌그러지지 않게 최소 너비 설정 */
`;

// 차트 제목 (ResultsPage에서 가져옴)
const ChartTitle = styled.h3`
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    margin-top: 0;
    margin-bottom: 16px;
    text-align: center;
`;

// 피그마 디자인과 유사한 색상 팔레트
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];

// 차트에 퍼센트(%) 라벨을 예쁘게 표시하기 위한 헬퍼 함수
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

// 'title', 'data', 'isDoughnut'을 props로 받는 컴포넌트
const CategoryPieChart = ({ title, data, isDoughnut = false }) => {
    return (
        <ChartBox>
        <ChartTitle>{title}</ChartTitle>
        {/* ResponsiveContainer는 차트가 부모(ChartBox) 크기에 맞춰 반응형으로 작동하게 함 */}
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel} // 위에서 만든 퍼센트 라벨 함수 적용
                outerRadius={100}
                // 'meat' 차트처럼 도넛 모양이 필요하면 innerRadius를 줍니다.
                innerRadius={isDoughnut ? 60 : 0} 
                fill="#8884d8"
                dataKey="value" // 'value' 키에 있는 숫자를 기준으로 차트를 그림
            >
                {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip /> {/* 마우스를 올렸을 때 정보 표시 */}
            <Legend /> {/* 차트 하단의 범례 표시 */}
            </PieChart>
        </ResponsiveContainer>
        </ChartBox>
    );
};

export default CategoryPieChart;