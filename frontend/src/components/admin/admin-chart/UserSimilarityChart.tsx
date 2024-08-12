'use client'

import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import api from '@/lib/axios';
import dynamic from 'next/dynamic';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Chart.js 컴포넌트 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Bar 컴포넌트 동적으로 임포트
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

const UserSimilarityChart: React.FC = () => {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  }>({
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

        setChartData({
          labels,
          datasets: [
            {
              label: '평균 유사도',
              data: similarityData,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
              label: '평균 정확도',
              data: accuracyData,
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching similarity data:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '지역별 평균 유사도 및 정확도',
      },
    },
  };

  return (
   <Bar options={options} data={chartData} />
  );
};

export default UserSimilarityChart;