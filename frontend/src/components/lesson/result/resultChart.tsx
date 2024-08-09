import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, Typography } from '@mui/material';

// ChartJS를 등록합니다.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LessonChartProps {
  userGraphY: string | null;
  sampleGraphY: string | null;
  lessonId: number;
}

const LessonChart: React.FC<LessonChartProps> = ({
  userGraphY,
  sampleGraphY,
  lessonId,
}) => {
  // "vocie_info_Y"를 null로 처리합니다.
  if (userGraphY === "vocie_info_Y") {
    userGraphY = null;
  }

  if (!userGraphY && !sampleGraphY) {
    return <Typography>No data available</Typography>;
  } 
  // else {
  //   console.log(userGraphY);
  //   console.log(sampleGraphY);
  // }

  // graphY 문자열을 배열로 파싱합니다.
  const userDataPoints: number[] = userGraphY ? JSON.parse(userGraphY) : [];
  const sampleDataPoints: number[] = sampleGraphY ? JSON.parse(sampleGraphY) : [];

  // 라벨링을 위한 가장 긴 데이터셋의 길이를 결정합니다.
  const maxLength = Math.max(userDataPoints.length, sampleDataPoints.length);

  const data = {
    labels: Array.from({ length: maxLength }, (_, index) => index + 1), // X축 라벨을 시간 인덱스로 설정합니다.
    datasets: [
      {
        label: `User`, // 사용자 데이터셋에 대한 레이블 설정
        data: userDataPoints,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        fill: true,
        pointRadius: 0, // 라인의 점을 숨깁니다.
      },
      {
        label: `Answer`, // 샘플 데이터셋에 대한 레이블 설정
        data: sampleDataPoints,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1,
        fill: true,
        pointRadius: 0, // 라인의 점을 숨깁니다.
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true, // 차트의 종횡비를 유지합니다.
    aspectRatio: 4, // 너비 대 높이 비율을 설정합니다.
    plugins: {
      legend: {
        display: true, // 범례를 표시합니다.
        position: 'left' as const, // 올바른 값으로 설정
        align: 'start' as const, // 범례를 시작 위치(좌측 상단)에 정렬합니다.
        labels: {
          boxWidth: 20, // 색상 박스의 너비
          font: {
            size: 12, // 범례 텍스트의 폰트 크기
          },
          color: '#000', // 폰트 색상
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: { raw: any; }) => `${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        display: false,
        title: {
          display: false,
          text: 'Time',
        },
      },
      y: {
        display: true, // y축 레이블을 숨깁니다.
        title: {
          display: false,
          text: 'Value',
        },
      },
    },
  };

  return (
    <Box className="w-full"> {/* 차트 컨테이너 크기 조정 */}
      <Line data={data} options={options} />
    </Box>
  );
};

export default LessonChart;
