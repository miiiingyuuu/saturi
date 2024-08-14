import {
  CircularProgress,
  Box,
  Typography,
  Button,
} from '@mui/material';
import LessonChart from './resultChart'; // Ensure correct import of the chart component
import { WidthFull } from '@mui/icons-material';

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
  currentStep : number;
  nextstep : any;
}

export default function FirstResult({
  lessonResult,
  lessonGroupResult,
  currentStep,
  nextstep,
}: FirstResultProps) {
  return (
    <Box className= "tmp"
      style={{
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems: "center",        
        height: '90vh', 
        width: "100%",
        left: (() => {
          if (currentStep === 1) {
            return "50%";
          } if (currentStep === 2) {
            return "-50%";
          } return "0%";              
      })()
    }}>
    <Box
      className="flex flex-col bg-white w-full max-w-4xl"
      sx={{
        border:"6px solid #4b2921",
        borderRadius:"30px",
      }}

    >
      {/* 라벨 부분 */}
      <Box
        className="flex flex-row items-center justify-between p-2"
      >
        <Box className="flex w-2/5 ml-2 justify-center">
          <Typography variant="caption" sx={{ fontWeight:"bold", fontSize: '1rem', whiteSpace: 'nowrap' }}>
            억양 분석
          </Typography>
        </Box>

        {/* Script Box */}
        <Box 
          className="flex flex-col justify-center w-2/5 ml-2" 
        >
          <Typography variant="caption" className="text-center" sx={{ fontWeight:"bold", fontSize: '1rem', whiteSpace: 'nowrap' }}>
            대사
          </Typography>         
        </Box>

        {/* Pronunciation and Accent Progress Circles */}
        <Box className="w-1/5 flex justify-around pl-2">
          <Box className="flex flex-col items-center">
            <Typography variant="caption" className="text-center" sx={{ fontWeight:"bold", fontSize: '1rem', whiteSpace: 'nowrap' }}>
              발음
            </Typography>
          </Box>
          <Box 
            className="flex flex-col items-center"
          >          
            <Typography variant="caption" className="text-center" sx={{ fontWeight:"bold", fontSize: '1rem', whiteSpace: 'nowrap' }}>
              억양
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 5개 부분 */}
      {lessonResult.map((lesson, index) => (
        <Box
          key={index}
          className="flex flex-row items-center justify-between p-2"
          sx={{ 
            height: '14vh', 
            borderTop: "2px solid lightgray"
          }}>
          {/* Chart Box */}
          <Box className="w-2/5" style={{ maxHeight: '100%', overflow: 'hidden' }}>
            <LessonChart userGraphY={lesson.userGraphY} sampleGraphY={lesson.sampleGraphY} lessonId={lesson.lessonId} />
          </Box>

          {/* Script Box */}
          <Box 
            className="flex flex-col justify-center w-2/5 ml-2" 
            sx={{
              paddingLeft:"15px",
              paddingRight:"15px",
            }}>
            <Typography variant="caption" className="text-gray-500" style={{ fontSize: '1rem', color:'rgba(75, 192, 192)' }}>
              {lesson.userScript ? lesson.userScript : '학습하지 않았어요'}
            </Typography>
            <Typography variant="body2" style={{ fontSize: '0.75rem' , color: 'rgba(255, 99, 132, 0.6)'}}>
              {lesson.sampleScript || '정답 스크립트 정보가 없습니다.'}
            </Typography> 
          </Box>

          {/* Pronunciation and Accent Progress Circles */}
          <Box className="w-1/5 flex justify-around pl-2">
            <Box className="flex flex-col items-center" position="relative" display="inline-flex">
            <CircularProgress
              variant="determinate"
              value={100} // 배경용: 항상 전체 표시
              size={60}
              thickness={4}
              sx={{
                color: "#e0e0e0", // 배경 색상 설정
                position: "absolute",
                left: 0,
              }}
            />              
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
              className="flex flex-col items-center" position="relative" display="inline-flex">
                <CircularProgress
              variant="determinate"
              value={100} // 배경용: 항상 전체 표시
              size={60}
              thickness={4}
              sx={{
                color: "#e0e0e0", // 배경 색상 설정
                position: "absolute",
                left: 0,
              }}
            />    
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
    <Box className="flex justify-center mx-24 py-1">
      <Button
        className="mt-4 bg-green-500 text-white px-8 py-4 rounded"
        variant="contained"
        sx={{
          backgroundColor:"success.light",
          '&:hover': { backgroundColor: 'green' },
          '&:active': { backgroundColor: 'green' },
          '&:focus': { backgroundColor: 'success' },
        }}
        onClick={nextstep}
      >
        다음
      </Button>
    </Box>
    </Box>
  );
}
