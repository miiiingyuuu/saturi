import { Button, Popover, Typography, Box } from "@mui/material";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface IPuzzlePiece {
  locationId: number | null;
  lessonGroupId: number;
  groupProgress: number;
  groupName : string;
}

export default function PuzzlePiece({ locationId, lessonGroupId, groupProgress, groupName }: IPuzzlePiece) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const currentPath = usePathname();

  const startLesson = () => {
    router.push(`${currentPath}/${lessonGroupId}`);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Box
        className="w-48 h-24 grid"
        sx={{
          display: "grid", // Grid layout 사용
          alignItems: "center", // 수직 중앙 정렬
          justifyItems: "center", // 수평 중앙 정렬
          width: "12rem", // 48 * 0.25rem (tailwind와 같은 스케일)
          height: "6rem", // 24 * 0.25rem (tailwind와 같은 스케일)
        }}
        onClick={handleClick}
      >
        <Typography variant="h5" component="p" className="grid justify-center ">
          {lessonGroupId}
        </Typography>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className="p-1 rounded-full">
          <Typography variant="h6" className="font-bold text-center">
            {groupName}
          </Typography>
          <Typography variant="subtitle1" className="">
            달성율 : {groupProgress}%
          </Typography>
          <div className="flex justify-center pt-2">
            <Button variant="contained" color="primary" onClick={startLesson}>
              Start
            </Button>
          </div>
        </div>
      </Popover>
    </div>
  );
}
