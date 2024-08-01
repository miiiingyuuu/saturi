import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Image from "next/image"
import Typography from '@mui/material/Typography';

export default function RightPart() {
  const router = useRouter();

  function GameStartButton() {
    router.push("/game");
  }

  return (
    <div className="rightpart" style={{ height: '100vh' }}>
      <Box sx={{ position: 'absolute', margin: "25px", top: "7%", right: "70px", width: "25vw" }}>
        <Typography variant="h1" sx={{ fontSize: 30, fontWeight: "bold" }}>게임 페이지</Typography>
        <br />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <Image src="/MainPage/buttonFood.png" alt="button food" width={200} height={200} />            
        </Box>
        <Button variant="contained" onClick={GameStartButton} style={{ marginTop: '20px' }}>게임 시작</Button>
      </Box>
    </div>
  );
}
