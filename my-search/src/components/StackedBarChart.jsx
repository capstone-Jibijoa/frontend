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
    min-width: 180px; 
    min-height: 500px; 
    display: flex;
    flex-direction: column;
`;

// 차트 제목
const ChartTitle = styled.h3`
    height: 50px;
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    margin-top: 0;
    margin-bottom: 16px;
    text-align: center;
    flex-shrink: 0;
`;

const ChartContent = styled.div`
    flex: 1;
`;

const LegendContainer = styled.ul`
    height: 100px;
    width: 100%;
    overflow-y: auto;
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;

    /* 스크롤바 */
    &::-webkit-scrollbar {
        width: 6px; 
    }
    &::-webkit-scrollbar-thumb {
        background-color: #d1d5db; /* 연한 회색 */
        border-radius: 10px; /* 둥글게 */
    }
    &::-webkit-scrollbar-track {
        background-color: transparent; 
    }
`;

const LegendItem = styled.li`
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #374151;
`;

const ColorBox = styled.span`
    width: 10px;
    height: 10px;
    background-color: ${props => props.color};
    margin-right: 5px;
    border-radius: 2px;
`;

const COLORS = ['#D64392', '#8A4AD6', '#4171D6',  '#2F9CA9', '#289C5E', '#C7952C', '#D9534F', '#F57C00', '#FBC02D', '#8BC34A', '#03A9F4'];

const getLegendText = (value) => {
    const maxLength = 4;
    return value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
};

const StackedBarChart = ({ title, data }) => {
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
    
    const renderLegend = (props) => {
        const { payload } = props; 
        
        return (
            <LegendContainer>
                {payload.map((entry, index) => (
                    <LegendItem key={`item-${index}`}>
                        <ColorBox color={entry.color} />
                        {getLegendText(entry.value)}
                    </LegendItem>
                ))}
            </LegendContainer>
        );
    };
    
    return (
        <ChartBox>
            <ChartTitle>{title}</ChartTitle>
            <ChartContent>
                <ResponsiveContainer width="100%" height="100%">
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
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                            dataKey="name" 
                            type="category"
                            width={80} 
                            tick={{ fontSize: 9, fill: '#374151' }}
                        />
                        <Tooltip formatter={(value) => `${value}%`} />
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
            </ChartContent>
            <LegendContainer>
                {allSegmentKeys.map((key, index) => (
                    <LegendItem key={`legend-${index}`}>
                        <ColorBox color={COLORS[index % COLORS.length]} />
                        {getLegendText(key)}
                    </LegendItem>
                ))}
            </LegendContainer>
        </ChartBox>
    );
};

export default StackedBarChart;