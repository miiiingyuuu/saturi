import { LinearProgress, Grid, Card } from "@mui/material";
import { useState, useEffect } from "react";
import PuzzlePiece from "./puzzlePiece";

interface PuzzleProps {
  id: number | null;
  totalProgress: number;
  eachLessonProgress: object | null;
  onSelect: (pieceId: number) => void; // 클릭된 퍼즐 조각을 부모에게 전달하는 함수
}

export default function Puzzle({ id, totalProgress=60, eachLessonProgress, onSelect }: PuzzleProps) {
  // 퍼즐 조각 데이터 (실제 데이터 가져오는 로직으로 대체 가능)
  const tempEachLessonProgress = [
    {
        "lessonGroupId": 1,
        "groupProgress": 100,
        "avgAccuracy": 80
    },
    {
        "lessonGroupId": 2,
        "groupProgress": 60,
        "avgAccuracy": 81
    },
    {
        "lessonGroupId": 3,
        "groupProgress": 20,
        "avgAccuracy": 82
    },
    {
        "lessonGroupId": 4,
        "groupProgress": 0,
        "avgAccuracy": 83
    },
    {
        "lessonGroupId": 5,
        "groupProgress": 0,
        "avgAccuracy": 84
    },
    {
        "lessonGroupId": 6,
        "groupProgress": 0,
        "avgAccuracy": 85
    },
    {
        "lessonGroupId": 7,
        "groupProgress": 0,
        "avgAccuracy": 86
    },
    {
        "lessonGroupId": 8,
        "groupProgress": 0,
        "avgAccuracy": 87
    },
    {
        "lessonGroupId": 9,
        "groupProgress": 0,
        "avgAccuracy": 88
    }
]

  const onClick = (piece: number) => {
    onSelect(piece); // 선택된 퍼즐 조각을 부모에게 전달
  };

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // progress를 totalProgress에 맞춰 설정
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
  }, [totalProgress]); // totalProgress가 변경될 때마다 useEffect 재실행

  return (
    <div>
      <div className="grid">
        <LinearProgress
          variant="determinate"
          value={progress}
          className="pb-4 m-10"
          aria-label="progress bar"
          sx={{
            height: 8, // 원하는 높이로 설정
            borderRadius: 5, // 테두리를 둥글게 설정
            '& .MuiLinearProgress-bar': {
              borderRadius: 5, // 진행 바 자체도 둥글게 설정
            },
          }}
        />
      </div>
      <Grid container spacing={2} className="grid p-5">
        {tempEachLessonProgress.map(piece => (
          <Grid item xs={4} key={piece.lessonGroupId}>
            <Card className="cursor-pointer" onClick={() => onClick(piece.lessonGroupId)}>
              <PuzzlePiece locationId={id} piece={piece.lessonGroupId} />
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
