import React from 'react';
import { Box, Typography } from "@mui/material";
import { FaCrown } from "react-icons/fa";

interface RankProps {
  userRank: number | null;
  isLoading: boolean;
}

const Rank: React.FC<RankProps> = ({ userRank, isLoading }) => {
  if (isLoading) {
    return <Typography>Loading rank data...</Typography>;
  }

  if (userRank === null) {
    return <Typography color="error">Failed to load rank data.</Typography>;
  }

  return (
    <Box display="flex" alignItems="center">
      <FaCrown color="gold" size={24} />
      <Typography variant="h6" sx={{ ml: 1 }}>
        전체 {userRank}위
      </Typography>
    </Box>
  );
};

export default Rank;