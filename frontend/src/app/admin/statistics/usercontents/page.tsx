'use client'

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import UserContentsTable from '@/components/admin/admin-statistics/UserContentsTable';

export default function UserContentsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        사용자 콘텐츠 통계
      </Typography>
      <Paper sx={{ p: 2 }}>
        <UserContentsTable />
      </Paper>
    </Box>
  );
}