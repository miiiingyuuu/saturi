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
import { Box } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export default function adminSampleGraph(
  { sampleVoicePitchY }: { sampleVoicePitchY: string }
) {
  let pitchData;

  try {
    pitchData = JSON.parse(sampleVoicePitchY);
  } catch (error) {
    pitchData = []; // 파싱이 실패하면 빈 배열을 반환
  }


  const data = {
    labels: Array.from({ length: pitchData.length }, (_, index) => index + 1), // X축 라벨을 시간 인덱스로 설정합니다.
    datasets: [
      {
        label: `Answer`, // 샘플 데이터셋에 대한 레이블 설정
        data: pitchData,
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
        display: false, // 범례를 표시합니다.
        position: 'left' as const, // 올바른 값으로 설정
        align: 'center' as const, // 범례를 시작 위치(좌측 상단)에 정렬합니다.
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
  )
}