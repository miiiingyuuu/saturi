import React from 'react';
import { Box, Typography } from "@mui/material";
import { FaFire } from "react-icons/fa";

interface ContinuousLearnDay {
    learnDays: number;
    daysOfTheWeek: number[];
  }
  
  interface WeeklyStreakProps {
    data: ContinuousLearnDay | null;
    isLoading: boolean;
  }

  const WeeklyStreak: React.FC<WeeklyStreakProps> = ({ data, isLoading }) => {
    if (isLoading) return <Typography>Loading...</Typography>;
    if (!data) return <Typography variant="h4">No weekly streak data available.</Typography>;
  
    const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];
  
    return (
      <Box>
        <Typography variant="h6" gutterBottom>주간 스트릭</Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2">24년 8월 1주차</Typography>
          <Typography variant="body2">
          {data.learnDays === 0
            ? "오늘 하루도 화이팅!"
            : data.learnDays === 1
              ? "계속해서 학습 해봐요!"
              : `${data.learnDays}일 연속 학습 중!`}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mt={2}>
          {daysOfWeek.map((day, index) => (
            <Box key={day} textAlign="center">
              <Typography variant="body2">{day}</Typography>
              <FaFire color={data.daysOfTheWeek.includes(index) ? "orange" : "gray"} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  };
  
  export default WeeklyStreak;