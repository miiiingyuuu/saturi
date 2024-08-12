'use client'

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import api from '@/lib/axios';

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

const UserLocationTable: React.FC = () => {
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

        const response = await api.get<StatisticsData>('/admin/statistics/user-location');

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

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Typography>No data available</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>지역</TableCell>
            <TableCell align="right">상대값 (%)</TableCell>
            <TableCell align="right">절대값 (명)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.relativeValue.map((item, index) => (
            <TableRow key={item.locationId}>
              <TableCell>{locationNames[item.locationId as keyof typeof locationNames]}</TableCell>
              <TableCell align="right">{item.userNum.toFixed(2)}%</TableCell>
              <TableCell align="right">{data.absoluteValue[index].userNum}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserLocationTable;