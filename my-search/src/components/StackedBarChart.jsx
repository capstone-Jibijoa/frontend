import React from 'react';
import styled from 'styled-components';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';

const BAR_COUNT = 8;

// 차트를 감싸는 박스
const ChartBox = styled.div`
    flex: 1;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    background-color: #ffffff;
    min-width: 150px; /* 차트의 최소 너비 설정 */
    min-height: 400px; /* 차트 박스의 최소 높이 설정 */
`;

// 차트 제목
const ChartTitle = styled.h3`
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    margin-top: 0;
    margin-bottom: 16px;
    text-align: center;
`;

const COLORS = ['#D64392', '#8A4AD6', '#4171D6',  '#2F9CA9', '#289C5E', '#C7952C', '#D9534F', '#F57C00', '#FBC02D', '#8BC34A', '#03A9F4'];

const StackedBarChart = ({ title, data }) => {
    // 모든 세그먼트 키 추출
    let segmentKeys = new Set();

    const chartData = Object.entries(data).map(([name, segments]) => {
        Object.keys(segments).forEach(key => segmentKeys.add(key));
        return {
            name,
            ...segments
        };
    });

    const allSegmentKeys = Array.from(segmentKeys);

    if (!chartData.length) {
        return <ChartBox><ChartTitle>{title}</ChartTitle>데이터 없음</ChartBox>;
    }
    const dynamicBarSize = chartData.length < BAR_COUNT ? 30 : undefined;
    
    return (
        <ChartBox>
            <ChartTitle>{title}</ChartTitle>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        type="number"
                        domain={[0, 100]}
                        unit="%"
                        ticks={[0, 50, 100]}
                        interval={0}
                    />
                    <YAxis 
                        dataKey="name" 
                        type="category" 
                        tick={{ fontSize: 10, fill: '#374151' }}
                    />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />

                    {allSegmentKeys.map((key, index) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            stackId="a" // 모든 Bar를 하나의 스택으로 묶음
                            fill={COLORS[index % COLORS.length]}
                            barSize={dynamicBarSize}
                        />
                ))}
                </BarChart>
            </ResponsiveContainer>
        </ChartBox>
    );
};

export default StackedBarChart;