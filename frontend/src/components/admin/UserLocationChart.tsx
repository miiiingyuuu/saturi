'use client'

import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import api from '@/lib/axios';

ChartJS.register(ArcElement, Tooltip, Legend);

interface LocationData {
  locationId: number;
  userNum: number;
}

interface StatisticsData {
  relativeValue: LocationData[];
  absoluteValue: LocationData[];
}

const locationNames = {
  1: '선택 안함',
  2: '경상도',
  3: '경기도',
  4: '강원도',
  5: '충청도',
  6: '전라도',
  7: '제주도'
};

const UserLocationChart: React.FC = () => {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const accessToken = sessionStorage.getItem('accessToken');
        
        if (!accessToken) {
          throw new Error('Access token not found');
        }

        const response = await api.get<StatisticsData>('/admin/statistics/user-location', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  const chartData = {
    labels: data.relativeValue.map(item => locationNames[item.locationId as keyof typeof locationNames]),
    datasets: [
      {
        data: data.relativeValue.map(item => item.userNum),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'
        ]
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '사용자 지역 분포'
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const relativeValue = context.raw || 0;
            const absoluteValue = data.absoluteValue.find(
              item => item.locationId === data.relativeValue[context.dataIndex].locationId
            )?.userNum || 0;
            return `${label}: ${relativeValue}% (${absoluteValue}명)`;
          }
        }
      }
    }
  };

  return <Pie data={chartData} options={options} />;
};

export default UserLocationChart;