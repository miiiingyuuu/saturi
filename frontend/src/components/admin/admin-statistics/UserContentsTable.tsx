'use client'

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import api from '@/lib/axios';

interface ContentData {
  lessonRate: number;
  gameRate: number;
}

const UserContentsTable: React.FC = () => {
  const [data, setData] = useState<ContentData | null>(null);
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

        setData(response.data);
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
        console.error('Error fetching content data:', err);
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
            <TableCell>콘텐츠 유형</TableCell>
            <TableCell align="right">비율 (%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>레슨</TableCell>
            <TableCell align="right">{data.lessonRate.toFixed(2)}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>게임</TableCell>
            <TableCell align="right">{data.gameRate.toFixed(2)}%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserContentsTable;