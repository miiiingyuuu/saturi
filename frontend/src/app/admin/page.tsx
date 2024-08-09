import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import UserLocationChart from '@/components/admin/admin-chart/UserLocationChart';
import UserContentsChart from '@/components/admin/admin-chart/UserContentsChart';
import UserLessonChart from '@/components/admin/admin-chart/UserLessonChart';
import UserSimilarityChart from '@/components/admin/admin-chart/UserSimilarityChart';

export default function StatisticsPage() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
        사용자 통계
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <UserLocationChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <UserContentsChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <UserSimilarityChart />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <UserLessonChart />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}