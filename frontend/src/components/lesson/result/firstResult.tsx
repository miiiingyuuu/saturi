import { Popover, LinearProgress, Button, Box, Typography } from "@mui/material";
import { useState } from "react";

export default function FirstResult() {
  // Dummy data
  const texts = [
    {
      id: 1,
      text: "마 니 국밥 무봤나",
      progress: { pronunciation: 60, intonation: 50 },
    },
    { id: 2, text: "마 니 자신있나", progress: { pronunciation: 90, intonation: 80 } },
    { id: 3, text: "맛이 깔끼하네", progress: { pronunciation: 70, intonation: 65 } },
    {
      id: 4,
      text: "블루베리 스무디",
      progress: { pronunciation: 80, intonation: 75 },
    },
    {
      id: 5,
      text: "이거 어디까지 올라가는 거에요?",
      progress: { pronunciation: 0, intonation: 0 },
    },
  ];

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
        {texts.map((item, index) => (
          <Box key={item.id} className="flex items-center justify-between mb-4">
            <Box>
              <Typography
                variant="h5"
                className={`font-bold ${index === 0 ? "text-black" : "text-gray-500"}`}
              >
                {item.text}
              </Typography>
              <Typography variant="subtitle2" className="text-gray-400">
                {item.text}
              </Typography>
            </Box>
            <Button variant="contained" color="primary" onClick={handleClick}>
              +
            </Button>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Box className="p-2">
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
        {texts.map((item) => (
          <Box key={item.id} className="flex justify-between items-center w-full mb-4">
            <Box className="w-1/2 pr-2">
              <LinearProgress
                variant="determinate"
                value={item.progress.pronunciation}
                color="secondary"
              />
              <Typography className="text-center text-lg font-bold text-orange-500 mt-2">
                {item.progress.pronunciation}%
              </Typography>
            </Box>
            <Box className="w-1/2 pl-2">
              <LinearProgress
                variant="determinate"
                value={item.progress.intonation}
                color="secondary"
              />
              <Typography className="text-center text-lg font-bold text-orange-500 mt-2">
                {item.progress.intonation}%
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
