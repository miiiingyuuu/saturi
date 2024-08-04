import { LinearProgress, Grid, Card } from "@mui/material";
import { useState, useEffect } from "react";
import PuzzlePiece from "./puzzlePiece";
import Jigsaw from "./jigsaw"

interface PuzzleProps {
  id: number | null;
  totalProgress: number;
  eachLessonProgress: object | null;
  onSelect: (pieceId: number, avgAccuracy: number) => void; // 전달되는 함수의 시그니처 변경
}

export default function Puzzle({ id, totalProgress, eachLessonProgress, onSelect }: PuzzleProps) {
  // 퍼즐 조각 데이터 (실제 데이터 가져오는 로직으로 대체 가능)
  const tempEachLessonProgress = [
    { 
      lessonGroupId: 1,
      lessonGroupName: "일상1",
      groupProgress: 100,
      avgAccuracy: 80,
    },
    {
      lessonGroupId: 2,
      lessonGroupName: "일상2",
      groupProgress: 60,
      avgAccuracy: 81,
    },
    {
      lessonGroupId: 3,
      lessonGroupName: "일상3",
      groupProgress: 20,
      avgAccuracy: 82,
    },
    {
      lessonGroupId: 4,
      lessonGroupName: "일상4",
      groupProgress: 0,
      avgAccuracy: 83,
    },
    {
      lessonGroupId: 5,
      lessonGroupName: "일상5",
      groupProgress: 0,
      avgAccuracy: 84,
    },
    {
      lessonGroupId: 6,
      lessonGroupName: "일상6",
      groupProgress: 0,
      avgAccuracy: 85,
    },
    {
      lessonGroupId: 7,
      lessonGroupName: "일상7",
      groupProgress: 0,
      avgAccuracy: 86,
    },
    {
      lessonGroupId: 8,
      lessonGroupName: "일상8",
      groupProgress: 0,
      avgAccuracy: 87,
    },
    {
      lessonGroupId: 9,
      lessonGroupName: "일상9",
      groupProgress: 0,
      avgAccuracy: 88,
    },
  ];

  const onJigsawClick = (piece: { lessonGroupId: number; avgAccuracy: number }) => {
    // lessonGroupId와 avgAccuracy를 전달
    onSelect(piece.lessonGroupId, piece.avgAccuracy);
  };

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 60) {
          clearInterval(timer);
          return 60;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 60);
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

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
            "& .MuiLinearProgress-bar": {
              borderRadius: 5, // 진행 바 자체도 둥글게 설정
            },
          }}
        />
      </div>
      <Grid container spacing={2} className="grid grid-cols-3 items-center">
        {/* 
          <<변동사항 설명>>
          puzzlePiece 부분을 아예 사용하지 않고 jigsaw로 대체함. 
          jigsaw 내에서 버튼을 클릭하면 팝오버 되도록 하고 
          이 컴포넌트의 onClick을 onJigsawClick으로 바꿔서 오른쪽 디테일 부분 바뀌도록 함.
         */}
        <Jigsaw
            dataGroup = {tempEachLessonProgress}
            onJigsawClick = {onJigsawClick}
          />        
        {/* 개인적인 생각엔 이 부분이랑 puzzlePiece 지워버려도 될 듯 
        {tempEachLessonProgress.map((piece) => (
          <Grid item xs={4} key={piece.lessonGroupId}>
            <Card
              className="cursor-pointer w-fit"
              onClick={() => onClick({ lessonGroupId: piece.lessonGroupId, avgAccuracy: piece.avgAccuracy })}
            >
              <PuzzlePiece
                locationId={id}
                lessonGroupId={piece.lessonGroupId}
                groupProgress={piece.groupProgress}
                groupName={piece.lessonGroupName}
              />
            </Card>
          </Grid>
        ))} */}
      </Grid>
    </div>
  );
}
