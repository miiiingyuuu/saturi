'use client'

import React, { useState, useEffect } from 'react';
import { Typography, Grid, Box } from '@mui/material';
import api from '@/lib/axios';
import dynamic from 'next/dynamic';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Bar = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), { ssr: false });

interface SimilarityData {
  locationId: number;
  avgSimilarity: number | null;
  avgAccuracy: number | null;
}

const locationNames: { [key: number]: string } = {
  2: '경상도',
  3: '경기도',
  4: '전라도',
  5: '충청도',
  6: '강원도',
  7: '제주도'
};

type ChartDataType = ChartData<'bar', number[], string>;

const UserSimilarityChart: React.FC = () => {
  const [similarityChartData, setSimilarityChartData] = useState<ChartDataType>({
    labels: [],
    datasets: []
  });
  const [accuracyChartData, setAccuracyChartData] = useState<ChartDataType>({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<SimilarityData[]>('/admin/statistics/avg-similarity');
        const labels = response.data.map(item => locationNames[item.locationId] || `Unknown (${item.locationId})`);
        const similarityData = response.data.map(item => item.avgSimilarity || 0);
        const accuracyData = response.data.map(item => item.avgAccuracy || 0);

        setSimilarityChartData({
          labels,
          datasets: [{
            label: '평균 유사도',
            data: similarityData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          }]
        });

        setAccuracyChartData({
          labels,
          datasets: [{
            label: '평균 정확도',
            data: accuracyData,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
          }]
        });
      } catch (error) {
        console.error('Error fetching similarity data:', error);
      }
    };

    fetchData();
  }, []);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <Grid container spacing={2} sx={{ height: '100%' }}>
      <Grid item xs={12} md={6} sx={{ height: '100%' }}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" align="center">지역별 평균 유사도</Typography>
          <Box sx={{ flexGrow: 1, minHeight: 0 }}>
            <Bar options={options} data={similarityChartData} />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={6} sx={{ height: '100%' }}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" align="center">지역별 평균 정확도</Typography>
          <Box sx={{ flexGrow: 1, minHeight: 0 }}>
            <Bar options={options} data={accuracyChartData} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default UserSimilarityChart;