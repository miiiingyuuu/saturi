import React from 'react';
import { Paper, Box, Typography, CircularProgress } from "@mui/material";
import { FaCrown } from "react-icons/fa";

interface RankProps {
  userRank: number | null;
  isLoading: boolean;
}

const Rank: React.FC<RankProps> = ({ userRank, isLoading }) => {
  if (isLoading) {
    return <CircularProgress size={24} />;
  }

  if (userRank === null) {
    return <Typography color="error">랭킹 정보를 불러올 수 없습니다.</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box display="flex" alignItems="center">
        <FaCrown color="gold" size={24} />
        <Typography variant="h6" sx={{ ml: 1 }}>
          전체 {userRank.toLocaleString()}위
        </Typography>
      </Box>
    </Paper>
  );
};

export default Rank;