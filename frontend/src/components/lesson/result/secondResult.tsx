import { LinearProgress, Button, Box } from "@mui/material";
import Image from "next/image";

export default function FirstResult() {
  return (
    <Box className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto p-6">
      <Box className="flex items-center m-5">
        <Image
          src="/images/Alopias.jpg"
          alt="티어 이미지"
          width={80}
          height={80}
          className="object-contain rounded-full"
        />
        <Box className="px-4 flex-grow">
          <LinearProgress
            variant="determinate"
            value={60}
            color="warning"
            className="w-full"
          />
        </Box>
      </Box>
      <Box className="flex justify-center mx-24 py-4">
        <Button variant="contained" color="success" className="mx-2">
          이전 조각
        </Button>
        <Button variant="contained" color="success" className="mx-2">
          다시하기
        </Button>
        <Button variant="contained" color="success" className="mx-2">
          다음 조각
        </Button>
      </Box>
      <Box className="flex justify-center mx-24 py-4">
        <Button variant="contained" color="success" className="w-full">
          Home
        </Button>
      </Box>
    </Box>
  );
}
