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
  // Treat "vocie_info_Y" as null
  if (userGraphY === "vocie_info_Y") {
    userGraphY = null;
  }

  if (!userGraphY && !sampleGraphY) {
    return <Typography>No data available</Typography>;
  } else {
    console.log(userGraphY);
    console.log(sampleGraphY);
  }

  // Parse the graphY strings to arrays
  const userDataPoints: number[] = userGraphY ? JSON.parse(userGraphY) : [];
  const sampleDataPoints: number[] = sampleGraphY ? JSON.parse(sampleGraphY) : [];

  // Determine the length of the longest dataset for labeling
  const maxLength = Math.max(userDataPoints.length, sampleDataPoints.length);

  const data = {
    labels: Array.from({ length: maxLength }, (_, index) => index + 1), // X-axis labels as time index
    datasets: [
      {
        label: `User`, // Set the label for the user dataset
        data: userDataPoints,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        fill: true,
        pointRadius: 0, // Hide the points on the line
      },
      {
        label: `Answer`, // Set the label for the sample dataset
        data: sampleDataPoints,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1,
        fill: true,
        pointRadius: 0, // Hide the points on the line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true, // Maintain chart aspect ratio
    aspectRatio: 4, // Set width to height ratio
    plugins: {
      legend: {
        display: true, // Display the legend
        position: 'left', // Position the legend on the left
        align: 'start', // Align the legend to the start (top-left)
        labels: {
          boxWidth: 20, // Width of the colored box
          font: {
            size: 12, // Font size of the legend text
          },
          color: '#000', // Font color
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw}`,
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
        display: false, // Ensure y-axis labels are hidden
        title: {
          display: false,
          text: 'Value',
        },
      },
    },
  };

  return (
    <Box className="w-full"> {/* Adjust chart container size */}
      <Line data={data} options={options} />
    </Box>
  );
};

export default LessonChart;
