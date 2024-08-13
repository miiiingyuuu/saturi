import { useRouter } from 'next/navigation';
import { Button, Box, Card, Typography, useMediaQuery, Container, Grid, Avatar } from "@mui/material";
import { RightPartProps } from '@/utils/props';
import Image from "next/image"
import api from '@/lib/axios';
import UserTierRank from '@/components/profile/userTierRank';
import { getCookie } from 'cookies-next';
import useConnect from "@/hooks/useConnect";

export default function RightPart({selectedRegion} : RightPartProps) {
  const router = useRouter();
  const profileImage = `/main_profile/${getCookie("birdId")}.png`

  function GameStartButton() {
    let region = 1;    
    switch (selectedRegion) {
      case "경상도":
        region = 2;
        break;
      case "경기도":
        region = 3;
        break;
      case "강원도":
        region = 4;
        break;
      case "충청도":
        region = 5;
        break;
      case "전라도":
        region = 6;
        break;
      case "제주도":
        region = 7;
        break;
      default:
        // eslint-disable-next-line no-console
        console.error("지역 설정 에러");
    }
    api.post("/game/room/in", {
      locationId: region
    })
    .then(response => {
      router.replace(`game/in-queue/${response.data.roomId}`)
    })
  }

  return (
    <Box 
      className="rightpart" 
      sx={{ 
        position: "absolute",
        width: "100%",
        minHeight: "700px",
        height: "90vh",
        display:"flex",
        alignItems:"center",
      }}>  
        <Container maxWidth="lg">
          <Card
            sx={{
              width: "100%",
              height: "560px",
              border: '3px solid lightgray', 
              borderRadius: 5,
              display: "flex",
              justifyContent:"flex-end",
              alignItems:"center",
            }}>  
            <Grid container spacing={0}>
              <Grid item xs={12} md={6}>

              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display:"flex", flexDirection: "column", alignItems:"center"}}>

                {/* 게임 페이지 */}
                <Typography variant="h1" sx={{ fontSize: { xs:25, sm:28, md:32, lg:39, xl:39 }, fontWeight: "bold", marginBottom:"10px" }}>게임 페이지</Typography>

                {/* 게임 프로필 */}
                <Box sx={{ width:"250px", height: "300px", display: 'grid', placeItems: 'center' }}>
                  <UserTierRank/>                    
                </Box>

                {/* 게임 시작 버튼 */}
                <Button 
                  variant="contained"
                  onClick={GameStartButton}
                  sx={{
                    backgroundColor:"success.light",
                    '&:hover': { backgroundColor: 'green' },
                    '&:active': { backgroundColor: 'green' },
                    '&:focus': { backgroundColor: 'success' },
                    marginTop: "20px", 
                    width: "200px", 
                    height: "50px", 
                    fontSize: { xs:17, sm:19, md:21, lg:23, xl:25 }
                  }}> 게임 시작 </Button>
                </Box>
              </Grid>
            </Grid>


            
          </Card>
        </Container>
    </Box>        
  );
}


{/* <Box sx={{ flexGrow: 1, height: '100vh' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={2}/>
        <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '85vh' }}>
            <Card sx={{ width: "100%", height: "75vh", border: '2px groove black', borderRadius: 5, backgroundColor: "whitesmoke" }} />
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