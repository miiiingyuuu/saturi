import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import UserLocationChart from '@/components/admin/UserLocationChart';
import UserContentsChart from '@/components/admin/UserContentsChart';
import UserLessonChart from '@/components/admin/UserLessonChart';
import UserSimilarityChart from '@/components/admin/UserSimilarityChart';

export default function StatisticsPage() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
        사용자 통계
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              지역별 사용자 현황
            </Typography>
            <UserLocationChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              사용자 콘텐츠 통계
            </Typography>
            <UserContentsChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              사용자 레슨 통계
            </Typography>
            <UserLessonChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              사용자 유사도/정확도 통계
            </Typography>
            <UserSimilarityChart />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}