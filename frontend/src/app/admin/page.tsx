'use client'

import React from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import UserLocationChart from '@/components/admin/admin-chart/UserLocationChart';
import UserContentsChart from '@/components/admin/admin-chart/UserContentsChart';
import UserLessonChart from '@/components/admin/admin-chart/UserLessonChart';
import UserSimilarityChart from '@/components/admin/admin-chart/UserSimilarityChart';

export default function StatisticsPage() {
  const router = useRouter();

  const handleChartClick = (path: string) => {
    router.push(path);
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
        사용자 통계
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              height: '100%', 
              cursor: 'pointer', 
              '&:hover': { boxShadow: 6 } 
            }}
            onClick={() => handleChartClick('/admin/statistics/userlocation')}
          >
            <Box>
              <Typography variant="h6" gutterBottom>지역별 사용자 현황</Typography>
              <UserLocationChart />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              height: '100%', 
              cursor: 'pointer', 
              '&:hover': { boxShadow: 6 } 
            }}
            onClick={() => handleChartClick('/admin/statistics/usercontents')}
          >
            <Box>
              <Typography variant="h6" gutterBottom>사용자 콘텐츠 통계</Typography>
              <UserContentsChart />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              height: '100%', 
              cursor: 'pointer', 
              '&:hover': { boxShadow: 6 } 
            }}
            onClick={() => handleChartClick('/admin/statistics/usersimilarity')}
          >
            <Box>
              <Typography variant="h6" gutterBottom>사용자 유사도/정확도 통계</Typography>
              <UserSimilarityChart />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              height: '100%', 
              cursor: 'pointer', 
              '&:hover': { boxShadow: 6 } 
            }}
            onClick={() => handleChartClick('/admin/statistics/userlesson')}
          >
            <Box>
              <Typography variant="h6" gutterBottom>사용자 레슨 통계</Typography>
              <UserLessonChart />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}