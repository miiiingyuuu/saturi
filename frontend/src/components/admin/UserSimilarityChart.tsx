import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'chart.js';
import { Typography, Box } from '@mui/material';
import api from '@/lib/axios';

interface SimilarityData {
  locationId: number;
  avgSimilarity: number | null;
  avgAccuracy: number | null;
}

interface ChartData {
  location: string;
  avgSimilarity: number;
  avgAccuracy: number;
}

const locationNames: { [key: number]: string } = {
  2: '경상도',
  3: '경기도',
  4: '전라도',
  5: '충청도',
  6: '강원도',
  7: '제주도'
};

const UserSimilarityChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<SimilarityData[]>('/admin/statistics/avg-similarity');
        const processedData: ChartData[] = response.data.map(item => ({
          location: locationNames[item.locationId] || `Unknown (${item.locationId})`,
          avgSimilarity: item.avgSimilarity || 0,
          avgAccuracy: item.avgAccuracy || 0
        }));
        setChartData(processedData);
      } catch (error) {
        console.error('Error fetching similarity data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Typography variant="h6" gutterBottom>
        지역별 평균 유사도 및 정확도
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="location" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="avgSimilarity" fill="#8884d8" name="평균 유사도" />
          <Bar dataKey="avgAccuracy" fill="#82ca9d" name="평균 정확도" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default UserSimilarityChart;