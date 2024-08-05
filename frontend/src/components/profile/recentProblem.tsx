import React from 'react';
import { Link ,Box, Typography, Avatar, LinearProgress } from "@mui/material";

const locationNames = {
    1: '정보 없음',
    2: '경상도',
    3: '경기도',
    4: '강원도',
    5: '충청도',
    6: '전라도',
    7: '제주도'
  };

interface RecentLessonGroup {
lessonGroupId: number;
lessonGroupName: string;
locationId: number;
categoryId: number;
avgSimilarity: number | null;
avgAccuracy: number | null;
startDt: string;
endDt: string | null;
isCompleted: boolean;
}

interface RecentProblemProps {
data: RecentLessonGroup | null;
isLoading: boolean;
}

const RecentProblem: React.FC<RecentProblemProps> = ({ data, isLoading }) => {
    if (isLoading) return <Typography>Loading...</Typography>;
    if (!data) return <Typography>No recent problem data available.</Typography>;
  
    // const formattedLessonName = data.lessonGroupName.replace(
    //   /^(\w+)/,
    //   (match) => locationNames[data.locationId as number] || match
    // );
  
    return (
        <Box>
          <Typography variant="h6" gutterBottom>최근 푼 문제</Typography>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'green', mr: 2 }}>GO</Avatar>
            <Box flexGrow={1}>
              <Typography variant="body1">{data.lessonGroupName}</Typography>
              <LinearProgress variant="determinate" value={data.avgAccuracy || 0} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                평균 정확도: {data.avgAccuracy ? `${data.avgAccuracy.toFixed(2)}%` : 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Box>
      );
    };
  
  export default RecentProblem;