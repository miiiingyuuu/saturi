import React from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography, Grid } from "@mui/material";
import 'react-calendar-heatmap/dist/styles.css';
// import ReactTooltip from 'react-tooltip';

// dynamic import
const ReactTooltip = dynamic(() => import('react-tooltip'), {
  ssr: false,
});
const CalendarHeatmap = dynamic(() => import('react-calendar-heatmap'), {
  ssr: false,
});

interface StreakInfo {
  streakDate: {
    year: number;
    month: number;
    day: number;
  };
  solvedNum: number;
}

interface TotalLessonInfo {
  totalLessonGroup: number;
  totalLesson: number;
}

interface YearlyStreakProps {
  data: StreakInfo[] | null;
  totalLessonInfo: TotalLessonInfo;
  isLoading: boolean;
}

const YearlyStreak: React.FC<YearlyStreakProps> = ({ data, totalLessonInfo, isLoading }) => {
  if (isLoading) return <Typography>Loading...</Typography>;
  if (!data || data.length === 0) return <Typography variant='h4'>No yearly streak data available.</Typography>;

  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear, 11, 31);

  const formattedData = data.map(item => ({
    date: `${item.streakDate.year}-${String(item.streakDate.month).padStart(2, '0')}-${String(item.streakDate.day).padStart(2, '0')}`,
    count: item.solvedNum
  }));
  console.log(formattedData)

  return (
    <Box>
      <Typography variant="h6" gutterBottom>연간 스트릭</Typography>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={formattedData}
        classForValue={(value) => {
          if (!value) {
            return 'color-empty';
          }
          return `color-scale-${Math.min(4, Math.floor(value.count / 3))}`;
        }}
        tooltipDataAttrs={(value: any) => {
          if (!value || !value.date) {
            return null;
          }
          const date = new Date(value.date);
          return {
            'data-tip': `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일: ${value.count}문제 해결`,
          };
        }}
      />
      <ReactTooltip />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={4}>
          <Typography>
            총 {totalLessonInfo.totalLessonGroup}개의 레슨 그룹을 완료했습니다.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography>
            총 {totalLessonInfo.totalLesson}개의 문제를 풀었습니다.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default YearlyStreak;