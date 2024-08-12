'use client'

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import api from '@/lib/axios';

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

const UserSimilarityTable: React.FC = () => {
  const [data, setData] = useState<SimilarityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<SimilarityData[]>('/admin/statistics/avg-similarity');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching similarity data:', error);
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (data.length === 0) return <Typography>No data available</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>지역</TableCell>
            <TableCell align="right">평균 유사도</TableCell>
            <TableCell align="right">평균 정확도</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.locationId}>
              <TableCell>{locationNames[item.locationId] || `Unknown (${item.locationId})`}</TableCell>
              <TableCell align="right">{item.avgSimilarity?.toFixed(2) || 'N/A'}</TableCell>
              <TableCell align="right">{item.avgAccuracy?.toFixed(2) || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserSimilarityTable;