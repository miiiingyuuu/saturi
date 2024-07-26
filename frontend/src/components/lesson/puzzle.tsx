import { Progress } from "@nextui-org/react";
import PuzzlePiece from "./puzzlePiece";

interface PuzzleProps {
  id: number | null;
  onSelect: (pieceId: number) => void; // 클릭된 퍼즐 조각을 부모에게 전달하는 함수
}

// async function getPuzzle(id: string) {
//   const response = await fetch(`문제그룹 받아오기/${id}`);
//   return response.json();
// }

export default function Puzzle({ id, onSelect }: PuzzleProps) {
  // const pieces = await getPuzzle(id);
  const pieces = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const onClick = (piece: number) => {
    onSelect(piece); // 선택된 퍼즐 조각을 부모에게 전달
  };

  return (
    <div>
      <Progress
        aria-label="progress bar"
        value={60}
        size="lg"
        className="max-w-md pb-4 m-auto"
      />
      <div className="grid grid-cols-3 gap-4">
        {pieces.map(piece => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div
            key={piece}
            className="border rounded-lg cursor-pointer p-0"
            onClick={() => onClick(piece)}
          >
            <PuzzlePiece locationId={id} piece={piece}/>
          </div>
        ))}
      </div>
    </div>
  );
}
