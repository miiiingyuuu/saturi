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


{/* <Box sx={{ flexGrow: 1, height: '100vh' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={2}/>
        <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '85vh' }}>
            <Card sx={{ width: "100%", height: "75vh", border: '2px solid black', borderRadius: 5, backgroundColor: "whitesmoke" }} />
          </Box>
          <Box sx={{ marginTop: 'auto', marginBottom: 2, width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h1" sx={{ fontSize: 39, fontWeight: "bold" }}>게임 페이지</Typography>
            <Card sx={{ width: "100%", maxWidth: 300, height: "auto", display: 'grid', placeItems: 'center', marginTop: 2 }}>
              <Image src="/MainPage/myLevel.png" alt="button food" width={200} height={200} />
            </Card>
            <Button variant="contained" onClick={GameStartButton} sx={{ marginTop: 2, width: "100%", maxWidth: 300, height: "auto", fontSize: "25px" }}>게임 시작</Button>
          </Box>
        </Grid>
        <Grid item xs={2}/>
      </Grid>
    </Box> */}