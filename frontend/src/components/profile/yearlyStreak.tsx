import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Box, Typography, Popover } from "@mui/material";

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

const CELL_SIZE = 15;
const CELL_GAP = 2;
const DAYS_IN_WEEK = 7;

// 마우스 오버시 해당 블록의 정보를 표시
interface TooltipProps {
  day: {
    date: Date;
    solvedNum: number;
  };
  anchorEl: Element | null;
  onClose: () => void;
}

const Tooltip: React.FC<TooltipProps> = ({ day, anchorEl, onClose }) => {
  const open = Boolean(anchorEl);
  
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="body2">
          날짜: {day.date.toLocaleDateString()}
        </Typography>
        <Typography variant="body2">
          푼 문제 수: {day.solvedNum}
        </Typography>
      </Box>
    </Popover>
  );
};

const YearlyStreak: React.FC<YearlyStreakProps> = ({ data, isLoading }) => {
  if (isLoading) return <Typography>Loading...</Typography>;
  if (!data) return <Typography variant='h4'>No yearly streak data available.</Typography>;

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [tooltipDay, setTooltipDay] = useState<{ date: Date; solvedNum: number } | null>(null);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  // 반응형으로 만들어주는 함수
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // 주어진 연도와 월의 일수를 반환하는 함수
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const streakData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const dataMap = new Map(data.map(d => [
      `${d.streakDate.year}-${d.streakDate.month}-${d.streakDate.day}`,
      d.solvedNum
    ]));
    
    const yearData = [];
    for (let month = 0; month < 12; month++) {
      const daysInMonth = getDaysInMonth(currentYear, month);
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, month, day);
        const key = `${currentYear}-${month + 1}-${day}`;
        yearData.push({
          date,
          solvedNum: dataMap.get(key) || 0
        });
      }
    }
    return yearData;
  }, [data]);

  const getColor = (solvedNum: number) => {
    if (solvedNum === 0) return '#ebedf0';
    if (solvedNum < 3) return '#9be9a8';
    if (solvedNum < 6) return '#40c463';
    if (solvedNum < 9) return '#30a14e';
    return '#216e39';
  };

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // 전체 주 수 계산
  const totalWeeks = Math.ceil(streakData.length / DAYS_IN_WEEK);
  const cellSize = Math.max(1, Math.min(CELL_SIZE, (containerWidth - (totalWeeks - 1) * CELL_GAP) / totalWeeks));
  const height = (cellSize + CELL_GAP) * DAYS_IN_WEEK + 30; // 월 라벨을 위한 추가 공간

  // 마우스 오버 함수
  const handleMouseEnter = (event: React.MouseEvent<SVGRectElement>, day: { date: Date; solvedNum: number }) => {
    setTooltipDay(day);
    if (event.currentTarget instanceof Element) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMouseLeave = () => {
    setTooltipDay(null);
    setAnchorEl(null);
  };

  return (
    <Box ref={containerRef}>
    <Typography variant="h6" gutterBottom>연간 스트릭</Typography>
    <svg width="100%" height={height} viewBox={`0 0 ${containerWidth} ${height}`} preserveAspectRatio="xMidYMid meet">
      {/* 월 라벨 표시 */}
      {monthLabels.map((month, index) => {
        const monthStartIndex = streakData.findIndex(d => d.date.getMonth() === index);
        const x = (monthStartIndex / DAYS_IN_WEEK) * (containerWidth / totalWeeks);
        return (
          <text
            key={month}
            x={x}
            y={20}
            fontSize={12}
            textAnchor="start"
          >
            {month}
          </text>
        );
      })}
        
        {/* 각 날짜별 기여도 셀 그리기 */}
        {streakData.map((day, index) => {
          const x = Math.floor(index / DAYS_IN_WEEK) * (containerWidth / totalWeeks);
          const y = (index % DAYS_IN_WEEK) * (cellSize + CELL_GAP) + 30;
          return (
            <g key={index}>
              <rect
              key={index}
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              fill={getColor(day.solvedNum)}
              onMouseEnter={(e) => handleMouseEnter(e, day)}
              onMouseLeave={handleMouseLeave}
            />
            <title>{`${day.date.toLocaleDateString()} - 푼 문제 수: ${day.solvedNum}`}</title>
            </g>            
          );
        })}
        
        {/* 월 구분선 그리기 */}
        {monthLabels.map((_, index) => {
          if (index === 0) return null;
          const monthStartIndex = streakData.findIndex(d => d.date.getMonth() === index);
          const x = (monthStartIndex / DAYS_IN_WEEK) * (containerWidth / totalWeeks);
          return (
            <line
              key={index}
              x1={x}
              y1={30}
              x2={x}
              y2={height}
              stroke="#000"
              strokeWidth="1"
            />
          );
        })}
      </svg>
      <Typography>
        {data.length}일 동안 학습했습니다.
      </Typography>
      {tooltipDay && (
        <Tooltip
          day={tooltipDay}
          anchorEl={anchorEl}
          onClose={handleMouseLeave}
        />
      )}
    </Box>
  );
};

export default YearlyStreak;