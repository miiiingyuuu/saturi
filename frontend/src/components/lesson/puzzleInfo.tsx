import { Box, LinearProgress, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

interface Lesson {
  lessonId: number;
  sampleVoicePath: string;
  sampleVoiceName: string;
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

interface PuzzleInfoProps {
  locationId: number | null;
  lessonGroup: LessonGroup;
  avgAccuracy: number; // 추가된 avgAccuracy 속성
}

export default function PuzzleInfo({
  locationId,
  lessonGroup,
  avgAccuracy,
}: PuzzleInfoProps) {
  const locations = ["", "경상도", "표준어"];
  const [location, setLocation] = useState("표준어");

  useEffect(() => {
    if (
      locationId !== null &&
      locationId >= 0 &&
      locationId < locations.length
    ) {
      setLocation(locations[locationId - 1]);
    }
  }, [locationId]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
      <Box
        sx={{
          height: "50%",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 2
        }}
      >
        <Typography variant="h6">평균 정확도</Typography>
        <br />
        <CircularProgress                    
          variant="determinate"
          value={avgAccuracy}
          size={100} // 크기 조절
          thickness={40} // 두께 조절
          color="success" // 색상 설정
        />
        <Typography variant="body1">{avgAccuracy}%</Typography> {/* 정확도 표시 */}
      </Box>
      <Box
        sx={{
          height: "90%",
          width: "110%",
          overflowY: 'auto', // 스크롤을 위해 추가
          textAlign: 'left'
        }}      >
        
        <ul className="list-disc pl-5">
          {lessonGroup.lessons.map(lesson => (
            <p key={lesson.lessonId} className="mb-2">
              <strong>{lesson.script}</strong>
            </p>
          ))}
        </ul>
      </Box>
    </Box>
  );
}
