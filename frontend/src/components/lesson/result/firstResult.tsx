import {
  Popover,
  LinearProgress,
  Button,
  Box,
  Typography,
} from "@mui/material";
import api from "@/lib/axios";
import { useState } from "react";

// props 속성 정의
interface LessonResultProps {
  lessonId: number;
  userVoicePath: string | null;
  userVoiceName: string | null;
  userScript: string | null;
  accentSimilarity: number | null;
  pronunciationAccuracy: number | null;
  lessonDt: string;
  isSkipped: boolean;
  isBeforeResult: boolean;
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

export default function FirstResult({ lessonResult, lessonGroupResult,}: FirstResultProps) {
  // lessonGroup 불러오는 api

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box className="flex bg-white rounded-lg shadow-lg w-full max-w-4xl">
      <Box className="flex flex-col w-3/4 p-4">
        {lessonResult.map((lesson, index) => (
          <Box
            key={lesson.lessonId}
            className="flex lessons-center justify-between mb-4"
          >
            <Box>
              <Typography
                variant="h5"
                className={`font-bold text-black`}
              >
                {/* 정답 스크립트 */}
                {lesson.userScript ? lesson.userScript : "없어요"}
                {/* {lesson.answerScript} 나중에 데이터에 생기면 이걸로 대체*/}
              </Typography>
              <Typography variant="subtitle2" className="text-gray-400">
                {/* 유저 스크립트 (usersScript) */}
                {lesson.userScript ? lesson.userScript : "학습하지 않았어요"}
              </Typography>
            </Box>
            <Button variant="contained" color="primary" onClick={handleClick}>
              {/* 차트가 나올 플러스창(인데 그냥 차트 보여줘도 될듯?) */}
              +
            </Button>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Box className="p-2">
                {/* 차트 이미지 들어갈 자리인데 그냥 보여줘도 되겠다 그죠? */}
                <Typography>Chart img</Typography>
              </Box>
            </Popover>
          </Box>
        ))}
      </Box>
      <Box className="flex flex-col w-1/4 p-4 bg-gray-50 rounded-r-lg">
        <Box className="flex justify-between w-full mb-2">
          <Typography variant="h6" className="w-1/2 text-center font-bold">
            발음
          </Typography>
          <Typography variant="h6" className="w-1/2 text-center font-bold">
            억양
          </Typography>
        </Box>
        {lessonResult.map((lesson) => (
          <Box
            key={lesson.lessonId}
            className="flex justify-between lessons-center w-full mb-4"
          >
            <Box className="w-1/2 pr-2">
              {/* 발음 정확도 원형바 progress */}
              <LinearProgress
                variant="determinate"
                value={lesson.pronunciationAccuracy ?? 0}
                color="secondary"
              />
              <Typography className="text-center text-lg font-bold text-orange-500 mt-2">
                {lesson.pronunciationAccuracy ?? 0}%
              </Typography>
            </Box>
            <Box className="w-1/2 pl-2">
              {/* 억양 정확도 원형바 progress */}
              <LinearProgress
                variant="determinate"
                value={lesson.accentSimilarity ?? 0}
                color="secondary"
              />
              <Typography className="text-center text-lg font-bold text-orange-500 mt-2">
                {lesson.accentSimilarity ?? 0}%
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
