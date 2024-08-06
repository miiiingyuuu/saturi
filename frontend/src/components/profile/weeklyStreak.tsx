import React from 'react';
import { Box, Typography } from "@mui/material";
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

  const formatWeekAndMonth = (weekAndMonth: number[]): string => {
    if (!weekAndMonth || weekAndMonth.length !== 2) {
      return '날짜 정보 없음';
    }
    
    // 월, 일 받아오기
    const [month, day] = weekAndMonth;
    const monthNames = [
      '1월', '2월', '3월', '4월', '5월', '6월', 
      '7월', '8월', '9월', '10월', '11월', '12월'
    ];
  
    // 월은 0부터 시작하므로 1을 빼줍니다.
    const monthName = monthNames[month - 1] || '알 수 없는 월';
  
    return `${monthName} ${day}주차`;
  };

  const WeeklyStreak: React.FC<WeeklyStreakProps> = ({ data, isLoading }) => {
    if (isLoading) return <Typography>Loading...</Typography>;
    if (!data) return <Typography variant="h4">No weekly streak data available.</Typography>;
  
    const formattedDate = formatWeekAndMonth(data.weekAndMonth);
    const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];
  
    return (
      <Box>
        <Typography variant="h6" gutterBottom>주간 스트릭</Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" sx={{ ml: 1 ,mt: 2 }}>24년 { formattedDate }</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Box display="flex" gap={12} sx={{ border: '1px solid black', borderRadius: '4px', padding: '8px' }}>  {/* 요일 간의 간격을 줄임 */}
            {daysOfWeek.map((day, index) => (
              <Box key={day} textAlign="center">
                <Typography variant="body2">{day}</Typography>
                <FaFire color={data.daysOfTheWeek.includes(index) ? "orange" : "gray"} />
              </Box>
            ))}
          </Box>
          <Box>  {/* 오른쪽에 연속 학습 일수 표시 */}
            <Typography variant="body2" fontWeight="bold">
              {data.learnDays > 0 ? `총 ${data.learnDays}일 동안` : ''}
            </Typography>
            <Typography variant="body2">접속 중!</Typography>
          </Box>
        </Box>
      </Box>
    );
  };
  
  export default WeeklyStreak;