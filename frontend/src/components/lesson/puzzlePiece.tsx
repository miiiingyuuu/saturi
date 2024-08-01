import {
  Button,
  Popover,
  Typography,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface IPuzzlePiece {
  locationId: number | null;
  piece: number;
}

export default function PuzzlePiece({ locationId, piece }: IPuzzlePiece) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const currentPath = usePathname();


  const startLesson = () => {
    router.push(`${currentPath}/${piece}`);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Box className="w-48 h-24 align-middle" onClick={handleClick}>
          <Typography variant="h5" component="p">
            {piece}
          </Typography>       
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        >
        <div className="p-1 rounded-full">
          <Typography variant="subtitle1" className="font-bold">
            문제 그룹 이름
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
