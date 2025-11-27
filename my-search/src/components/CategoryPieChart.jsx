import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MAX_ITEMS = 10;

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
    gap: 5px;

    /* 스크롤바 */
    &::-webkit-scrollbar {
        width: 6px; 
    }
    &::-webkit-scrollbar-thumb {
        background-color: #d1d5db;
        border-radius: 10px;
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

// 데이터가 없을 때 보여줄 메시지
const NoDataMessage = styled.div`
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
`

// 차트에 사용할 색상
const COLORS = ['#D64392', '#8A4AD6', '#4171D6',  '#2F9CA9', '#289C5E', '#C7952C', '#D9534F', '#F57C00', '#FBC02D', '#8BC34A', '#03A9F4'];

// 차트에 퍼센트(%) 표시하기 위한 헬퍼 함수
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, payload }) => {
    if (payload.realPercent < 10) {
        return null;
    }

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text 
            x={x} 
            y={y} 
            fill="white" 
            textAnchor="middle" 
            dominantBaseline="central"
            fontSize={13}
        >
            {`${Math.round(payload.realPercent)}%`}
        </text>
    );
};

// 항목 길이가 너무 길면 '...'으로 줄이는 함수
const getLegendText = (value) => {
    const maxLength = 4;
    return value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
};

const CategoryPieChart = ({ title, data }) => {
    const hasData = data && data.length > 0;
    const totalValue = hasData ? data.reduce((acc, cur) => acc + cur.value, 0) : 0;
    const chartData = hasData 
            ? data.slice(0, MAX_ITEMS).map(item => ({
                ...item,
                realPercent: (item.value / totalValue) * 100
            }))
            : [];
    
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
            {!hasData ? (
                <NoDataMessage>일치하는 데이터가 없습니다.</NoDataMessage>
            ) : (
                <ChartContent>
                    <ResponsiveContainer width="100%" height="100%"> 
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius="80%"
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value, name, props) => {
                                    return [`${props.payload.realPercent.toFixed(1)}%`, name];
                                }} 
                            />
                            <Legend 
                                content={renderLegend} 
                                verticalAlign="bottom"
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContent>
            )}
        </ChartBox>
    );
};

export default CategoryPieChart;