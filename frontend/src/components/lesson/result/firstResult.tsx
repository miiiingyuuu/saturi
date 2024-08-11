import {
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import LessonChart from './resultChart'; // Ensure correct import of the chart component

// Props interfaces
interface LessonResultProps {
  lessonId: number;
  userVoicePath: string | null;
  userVoiceName: string | null;
  userScript: string | null;
  sampleScript: string | null;
  sampleGraphX: null;
  sampleGraphY: string | null;
  accentSimilarity: number | null;
  pronunciationAccuracy: number | null;
  lessonDt: string;
  isSkipped: boolean;
  isBeforeResult: boolean;  
  userGraphX: string | null;
  userGraphY: string | null;
}

interface LessonGroupResult {
  lessonGroupId: number;
  lessonGroupName: string;
  avgAccuracy: number;
  avgSimilarity: number;
  startDt: string;
  endDt: string | null;
  isCompleted: boolean; 
}

interface FirstResultProps {
  lessonResult: LessonResultProps[];
  lessonGroupResult: LessonGroupResult;
}

export default function FirstResult({
  lessonResult,
  lessonGroupResult,
}: FirstResultProps) {
  return (
    <Box
      className="flex flex-col bg-white rounded-lg shadow-lg w-full max-w-4xl"
      style={{ height: '75vh', overflow: 'hidden' }} // Remove scroll and fit height
    >
      {/* Labels for pronunciation and accent similarity */}
      <Box className="flex justify-end items-center w-full pr-2" sx={{ paddingBottom: '8px' }}>
        <Box className="w-1/5 flex justify-around">
          <Typography variant="caption" className="text-center" sx={{ fontSize: '1rem', whiteSpace: 'nowrap' }}>
            발음
          </Typography>
          <Typography variant="caption" className="text-center" sx={{ fontSize: '1rem', whiteSpace: 'nowrap' }}>
            억양
          </Typography>
        </Box>
      </Box>
      {lessonResult.map((lesson, index) => (
        <Box
          key={index}
          className="flex flex-row items-center justify-between p-2"
          sx={{ 
            height: '15vh', 
            borderTop: "2px solid lightgray"
          }}>
          {/* Chart Box */}
          <Box className="w-2/5" style={{ maxHeight: '100%', overflow: 'hidden' }}>
            <LessonChart userGraphY={lesson.userGraphY} sampleGraphY={lesson.sampleGraphY} lessonId={lesson.lessonId} />
          </Box>

          {/* Script Box */}
          <Box className="flex flex-col justify-center w-2/5 ml-2">
            <Typography variant="body2" style={{ fontSize: '1rem' }}>
              {lesson.sampleScript || '정답 스크립트 정보가 없습니다.'}
            </Typography> 
            <Typography variant="caption" className="text-gray-500" style={{ fontSize: '0.75rem' }}>
              {lesson.userScript ? lesson.userScript : '학습하지 않았어요'}
            </Typography>
          </Box>

          {/* Pronunciation and Accent Progress Circles */}
          <Box className="w-1/5 flex justify-around pl-2">
            <Box className="flex flex-col items-center">
              <CircularProgress
                variant="determinate"
                value={lesson.pronunciationAccuracy || 0}
                size={60} // Set the size of the circular progress
                thickness={4} // Set the thickness of the circular progress
              />
              <Typography className="text-xs font-bold text-orange-500 mt-1">
                {lesson.pronunciationAccuracy || 0}%
              </Typography>
            </Box>
            <Box 
              className="flex flex-col items-center">
              <CircularProgress
                variant="determinate"
                value={lesson.accentSimilarity || 0}
                size={60} // Set the size of the circular progress
                thickness={4} // Set the thickness of the circular progress
              />
              <Typography className="text-xs font-bold text-orange-500 mt-1">
                {lesson.accentSimilarity || 0}%
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}      
    </Box>
  );
}
