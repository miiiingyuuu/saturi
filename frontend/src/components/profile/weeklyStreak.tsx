import React from 'react';
import { Box, Typography, Grid } from "@mui/material";
import { FaFire } from "react-icons/fa";

interface ContinuousLearnDay {
  learnDays: number;
  daysOfTheWeek: number[];
  weekAndMonth: number[];
}

interface WeeklyStreakProps {
  data: ContinuousLearnDay | null;
  isLoading: boolean;
}

const formatWeekAndMonth = (weekAndMonth: number[] | undefined): string => {
  if (!weekAndMonth || weekAndMonth.length !== 2) {
    return '날짜 정보 없음';
  }
  
  const [month, week] = weekAndMonth;
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월', 
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const monthName = monthNames[month - 1] || '알 수 없는 월';

  return `${monthName} ${week}주차`;
};

const WeeklyStreak: React.FC<WeeklyStreakProps> = ({ data, isLoading }) => {
  if (isLoading) return <Typography>Loading...</Typography>;

  const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];
  const formattedDate = formatWeekAndMonth(data?.weekAndMonth);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>주간 스트릭</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ mt: 2 }}>24년 {formattedDate}</Typography>
        </Grid>
        <Grid item xs={12} md={7}>
          <Box display="flex" gap={1} sx={{ overflowX: 'auto' }}>
            {daysOfWeek.map((day, index) => (
              <Box key={day} textAlign="center" sx={{ minWidth: '50px' }}>
                <Typography variant="body2">{day}</Typography>
                <FaFire color={data && data.daysOfTheWeek.includes(index) ? "orange" : "gray"} />
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            {data ? (
              <>
                <Typography>사투리가 서툴러유와 함께한지</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {data.learnDays > 0 ? ` ${data.learnDays}일!` : ''}
                </Typography>
              </>
            ) : (
              <>
                <Typography>스트릭을 시작해보세요!</Typography>
                <Typography variant="h5" fontWeight="bold">학습을 시작하세요!</Typography>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WeeklyStreak;