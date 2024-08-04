import { useRouter } from 'next/navigation';
import { Button, Box, Card, Typography } from "@mui/material";
import Image from "next/image"

export default function RightPart() {
  const router = useRouter();

  function GameStartButton() {
    router.push("/game");
  }

  return (
    <Box className="rightpart" style={{ height: '100vh' }}>
      <Box sx={{ display: 'grid', placeItems: 'center', height: '85vh' }}>
        <Card sx={{ width: "65vw", height:"75vh", border: '2px solid black', borderRadius: 5, top:"-50%", backgroundColor: "whitesmoke" }} />
      </Box>

      <Box sx={{ position: 'absolute', margin: "25px", top: "7%", right: "20%", width: "25vw", display:"flex", flexDirection: "column",  alignItems: "center" }}>
        <Typography variant="h1" sx={{ fontSize: 39, fontWeight: "bold" }}>게임 페이지</Typography>
        <br />
        <Box sx={{  }}>
          <Card sx={{ width:"15vw", height: "39vh", display: 'grid', placeItems: 'center' }}>
            <Image src="/MainPage/myLevel.png" alt="button food" width={200} height={200} />
          </Card>                  
        </Box>
        <Button variant="contained" onClick={GameStartButton} sx={{ marginTop: "20px", width: "15vw", height: "5vh", fontSize: "25px"  }}>게임 시작</Button>
      </Box>
    </Box>
  );
}