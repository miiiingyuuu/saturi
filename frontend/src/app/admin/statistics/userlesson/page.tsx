'use client'

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import UserLessonTable from '@/components/admin/admin-statistics/UserLessonTable';

export default function UserLessonPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        사용자 레슨 통계
      </Typography>
      <Paper sx={{ p: 2 }}>
        <UserLessonTable />
      </Paper>
    </Box>
  );
}