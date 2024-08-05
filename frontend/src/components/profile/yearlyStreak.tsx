import React from 'react';
import { Box, Typography } from "@mui/material";

interface StreakInfo {
  streakDate: {
    year: number;
    month: number;
    day: number;
  };
  solvedNum: number;
}

interface YearlyStreakProps {
  data: StreakInfo[] | null;
  isLoading: boolean;
}

const YearlyStreak: React.FC<YearlyStreakProps> = ({ data, isLoading }) => {
  if (isLoading) return <Typography>Loading...</Typography>;
  if (!data) return <Typography>No yearly streak data available.</Typography>;

  // 여기서 실제 차트를 구현 필요 

  return (
    <Box>
      <Typography variant="h6" gutterBottom>연간 스트릭</Typography>
      <Box height={200} bgcolor="lightgray" display="flex" alignItems="center" justifyContent="center">
        <Typography>
          {data.length}일 동안 학습했습니다. (상세 차트 구현 필요)
        </Typography>
      </Box>
    </Box>
  );
};

export default YearlyStreak;