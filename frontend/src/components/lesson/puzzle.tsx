import { LinearProgress, Grid, Card, Box } from "@mui/material";
import { useState, useEffect } from "react";
import PuzzlePiece from "./puzzlePiece";

interface PuzzleProps {
  id: number | null;
  onSelect: (pieceId: number) => void; // Function to pass the clicked puzzle piece to the parent
}

export default function Puzzle({ id, onSelect }: PuzzleProps) {
  // Simulated pieces data, replace with actual data fetching logic
  const pieces = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const onClick = (piece: number) => {
    onSelect(piece); // Pass the selected puzzle piece to the parent
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
      <div>
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
      <Grid container spacing={2}>
        {pieces.map(piece => (
          <Grid item xs={4} key={piece}>
            <Card className="cursor-pointer w-full h-full" onClick={() => onClick(piece)}>
                <PuzzlePiece locationId={id} piece={piece} />
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
