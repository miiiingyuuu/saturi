'use client'

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import api from '@/lib/axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface LessonData {
  lessonId: number;
  value: number;
}

interface ChartData {
  sortedByCompletedNum: LessonData[];
  sortedByAvgSimilarity: LessonData[];
  sortedByAvgAccuracy: LessonData[];
  sortedByClaimNum: LessonData[];
}

const UserLessonChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
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

        const response = await api.get<ChartData>('/admin/statistics/lesson', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        setChartData(response.data);
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
        console.error('Error fetching lesson data:', err);
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

  const createChartData = (data: LessonData[], label: string) => ({
    labels: data.map(item => `Lesson ${item.lessonId}`),
    datasets: [{
      label: label,
      data: data.map(item => item.value),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">완료 횟수 순</Typography>
          <Bar data={createChartData(chartData.sortedByCompletedNum, '완료 횟수')} options={options} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">평균 파형 유사도 순</Typography>
          <Bar data={createChartData(chartData.sortedByAvgSimilarity, '평균 파형 유사도')} options={options} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">평균 발음 정확도 순</Typography>
          <Bar data={createChartData(chartData.sortedByAvgAccuracy, '평균 발음 정확도')} options={options} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">레슨 신고횟수 순</Typography>
          <Bar data={createChartData(chartData.sortedByClaimNum, '레슨 신고횟수')} options={options} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserLessonChart;