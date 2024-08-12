import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography, Grid } from "@mui/material";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './styles.css'

// dynamic import
const ReactTooltip = dynamic(() => import('react-tooltip'), {
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

  const startDate = useMemo(() => new Date(new Date().getFullYear(), 0, 1), []);
  const endDate = useMemo(() => new Date(new Date().getFullYear(), 11, 31), []);

  const formattedData = useMemo(() => data ? data.map(item => ({ 
    date: `${item.streakDate.year}-${String(item.streakDate.month).padStart(2, '0')}-${String(item.streakDate.day).padStart(2, '0')}`,
    count: item.solvedNum
  })) : [], [data]);

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
          return `color-scale-${Math.min(10, value.count)}`;
        }}
        tooltipDataAttrs={(value: any) => {
          if (!value || !value.date) {
            return null;
          }
          const date = new Date(value.date);
          return {
            'data-tip': `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일: ${value.count || 0}문제 해결`,
          };
        }}
      />
      <ReactTooltip />
      {!data || data.length === 0 && (
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
          아직 스트릭 데이터가 없습니다.
        </Typography>
      )}
      <Grid container spacing={2} sx={{ mt: 2, textAlign: 'center' }}>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 'bold' }}>
            총 {totalLessonInfo ? totalLessonInfo.totalLessonGroup : 0}개의 레슨 그룹을 완료했습니다!
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 'bold' }}>
            총 {totalLessonInfo ? totalLessonInfo.totalLesson : 0}개의 문제를 풀었습니다!
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default YearlyStreak;