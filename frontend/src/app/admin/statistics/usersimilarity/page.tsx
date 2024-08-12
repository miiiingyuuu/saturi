'use client'

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import UserSimilarityTable from '@/components/admin/admin-statistics/UserSimilarityTable';

export default function UserSimilarityPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        사용자 유사도/정확도 통계
      </Typography>
      <Paper sx={{ p: 2 }}>
        <UserSimilarityTable />
      </Paper>
    </Box>
  );
}