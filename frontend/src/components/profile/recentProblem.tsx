import React from 'react';
import { Link ,Box, Typography, Avatar, LinearProgress } from "@mui/material";

// 지역 코드 한글로 반환
const getDisplayName = (lessonGroupName: string): string => {
  const regionMappings = {
    'gyungsang': '경상도 사투리 -',
    'gyunggi': '경기도 사투리 -',
    'gangwon': '강원도 사투리 -',
    'chungcheong': '충청도 사투리 -',
    'jeolla': '전라도 사투리 -',
    'jeju': '제주도 사투리 -'
  };

  let displayName = lessonGroupName;
  Object.entries(regionMappings).forEach(([eng, kor]) => {
    const regex = new RegExp(eng, 'gi');
    if (regex.test(displayName)) {
      displayName = displayName.replace(regex, kor);
    }
  });

  return displayName;
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

    return (
      <Box sx={{ borderRadius: '16px' }}>
        <Typography variant="h6" gutterBottom>최근 푼 문제</Typography>
        {/* 데이터가 있을 시... */}
        {data ? (
          <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
            <Avatar sx={{ bgcolor: 'green', mr: 2 }}>GO</Avatar>
            <Box flexGrow={1}>
              <Typography variant="body1">{getDisplayName(data.lessonGroupName)}</Typography>
              <LinearProgress variant="determinate" value={data.avgAccuracy || 0} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                평균 정확도: {data.avgAccuracy ? `${data.avgAccuracy.toFixed(2)}%` : '데이터가 아직 없어요...'}
              </Typography>
            </Box>
          </Box>
        ) : (
          // 데이터가 없을 시...
          <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
            {/* TODO : 해당 문제로 가는 router 필요한데, 이거 구현되나? */}
            <Avatar sx={{ bgcolor: 'grey', mr: 2 }}>-</Avatar>
            <Box flexGrow={1}>
              <Typography variant="body1">최근에 학습한 문제가 없어요...</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                새로운 문제를 풀어보세요!
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    );
    };
  
  export default RecentProblem;