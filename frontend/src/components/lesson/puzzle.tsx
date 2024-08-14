import { LinearProgress, Grid, Card, Box } from "@mui/material";
import { useState, useEffect } from "react";
import Jigsaw from "./jigsaw"

interface Lesson {
  lessonId: number;
  sampleVoicePath: string;
  sampleVoiceName: string; // Updated field name
  script: string;
  lastUpdateDt: string;
  isDeleted: boolean;
}

interface LessonGroup {
  lessonGroupId: number;
  locationName: string;
  lessonCategoryName: string;
  name: string;
  lessons: Lesson[];
}

interface PuzzleProps {
  id: number | null;
  totalProgress: number;
  lessonGroup: LessonGroup[];
  onSelect: (pieceId: number, avgAccuracy: number) => void; // 전달되는 함수의 시그니처 변경
  progressData :  {
    lessonGroupId: number;
    lessonGroupName: string;
    groupProgress: number;
    avgAccuracy: number;
    }[]
}

export default function Puzzle({ id, totalProgress, lessonGroup, progressData, onSelect }: PuzzleProps) {
  // 퍼즐 조각 데이터 (실제 데이터 가져오는 로직으로 대체 가능)

  useEffect(() => {
    console.log("lessonGroup data:", lessonGroup);
  }, [lessonGroup]);
  
  const onJigsawClick = (piece: { lessonGroupId: number; avgAccuracy: number }) => {
    // lessonGroupId와 avgAccuracy를 전달
    onSelect(piece.lessonGroupId, piece.avgAccuracy);
  };

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(totalProgress)
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= totalProgress) {
          clearInterval(timer);
          return totalProgress;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, totalProgress);
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box>
      {/* 첫 번째: 프로그레스 바 */}
      <Box className="grid">
        <LinearProgress
          variant="determinate"
          value={progress}
          className="pb-4 mb-5"
          aria-label="progress bar"
          sx={{
            height: 8, // 원하는 높이로 설정
            border: "3px solid #414141",
            borderRadius: 5, // 테두리를 둥글게 설정
            "& .MuiLinearProgress-bar": {
              borderRadius: 5, // 진행 바 자체도 둥글게 설정
            },
          }}
        />
      </Box>

      {/* 두 번째: 직소 */}
      <Box sx={{display:"flex", justifyContent:"center"}}>
        {/* 
          <<변동사항 설명>>
          puzzlePiece 부분을 아예 사용하지 않고 jigsaw로 대체함. 
          jigsaw 내에서 버튼을 클릭하면 팝오버 되도록 하고 
          이 컴포넌트의 onClick을 onJigsawClick으로 바꿔서 오른쪽 디테일 부분 바뀌도록 함.
         */}
        <Jigsaw
            dataGroup = {lessonGroup}
            onJigsawClick = {onJigsawClick}
            progressData={progressData}
          />        
      </Box>
    </Box>
  );
}
