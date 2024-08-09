'use client'

import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, Typography, CircularProgress } from '@mui/material';
import api from '@/lib/axios';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ContentData {
  lessonRate: number;
  gameRate: number;
}

const UserContentsChart: React.FC = () => {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      hoverBackgroundColor: string[];
    }[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found');
        }

        const response = await api.get<ContentData>('/admin/statistics/content', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        const { lessonRate, gameRate } = response.data;
        setChartData({
          labels: ['레슨', '게임'],
          datasets: [{
            data: [lessonRate, gameRate],
            backgroundColor: ['#FF6384', '#36A2EB'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB']
          }]
        });
      } catch (err) {
        setError('데이터가 없어요...');
        console.error('Error fetching content data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!chartData) {
    return <Typography>No data available</Typography>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '레슨 vs 게임 사용 비율',
      },
    },
  };

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <Pie data={chartData} options={options} />
    </Box>
  );
};

export default UserContentsChart;