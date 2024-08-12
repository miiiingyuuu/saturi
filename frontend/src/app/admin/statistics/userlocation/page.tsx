'use client'

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import UserLocationTable from '@/components/admin/admin-statistics/UserLocationTable';

export default function UserLocationPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        사용자 지역 통계
      </Typography>
      <Paper sx={{ p: 2 }}>
        <UserLocationTable />
      </Paper>
    </Box>
  );
}