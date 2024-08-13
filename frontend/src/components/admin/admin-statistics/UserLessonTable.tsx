'use client'

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Tabs, Tab, Box } from '@mui/material';
import api from '@/lib/axios';

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

const UserLessonTable: React.FC = () => {
  const [data, setData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

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

        setData(response.data);
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
        console.error('Error fetching lesson data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Typography>No data available</Typography>;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderTable = (dataSet: LessonData[], label: string) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>레슨 ID</TableCell>
            <TableCell align="right">{label}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataSet.map((item) => (
            <TableRow key={item.lessonId}>
              <TableCell>{item.lessonId}</TableCell>
              <TableCell align="right">{item.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="완료 횟수" />
        <Tab label="평균 유사도" />
        <Tab label="평균 정확도" />
        <Tab label="신고 횟수" />
      </Tabs>
      {tabValue === 0 && renderTable(data.sortedByCompletedNum, '완료 횟수')}
      {tabValue === 1 && renderTable(data.sortedByAvgSimilarity, '평균 유사도')}
      {tabValue === 2 && renderTable(data.sortedByAvgAccuracy, '평균 정확도')}
      {tabValue === 3 && renderTable(data.sortedByClaimNum, '신고 횟수')}
    </Box>
  );
};

export default UserLessonTable;