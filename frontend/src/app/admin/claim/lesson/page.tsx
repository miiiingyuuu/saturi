"use client"

import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import api from '@/lib/axios';

interface LessonClaim {
  lessonClaimId: number;
  lessonId: number;
  userId: number;
  content: string;
  claimDt: string;
}

const useLessonClaims = () => {
  const [claims, setClaims] = useState<LessonClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await api.get<LessonClaim[]>('/admin/lesson/claim');
        setClaims(response.data);
      } catch (err) {
        setError('Failed to fetch lesson claims');
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  return { claims, loading, error };
};

const LessonClaimsTable: React.FC<{ claims: LessonClaim[] }> = ({ claims }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="lesson claims table">
        <TableHead>
          <TableRow>
            <TableCell>Claim ID</TableCell>
            <TableCell>Lesson ID</TableCell>
            <TableCell>User ID</TableCell>
            <TableCell>Content</TableCell>
            <TableCell>Claim Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {claims.map((claim) => (
            <TableRow
              key={claim.lessonClaimId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {claim.lessonClaimId}
              </TableCell>
              <TableCell>{claim.lessonId}</TableCell>
              <TableCell>{claim.userId}</TableCell>
              <TableCell>{claim.content}</TableCell>
              <TableCell>{new Date(claim.claimDt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const LessonClaimsPage: React.FC = () => {
  const { claims, loading, error } = useLessonClaims();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box m={2}>
      <Typography variant="h4" component="h1" gutterBottom>
        레슨 신고 내용
      </Typography>
      <LessonClaimsTable claims={claims} />
    </Box>
  );
};

export default LessonClaimsPage;