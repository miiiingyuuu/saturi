import { useRouter } from 'next/navigation';
import { Button, Box, Card, Typography, useMediaQuery, Container, Grid } from "@mui/material";
import Image from "next/image"

export default function RightPart() {
  const router = useRouter();

  function GameStartButton() {
    router.push("/game");
  }

  const isDesktop = useMediaQuery('(min-width:768px)');
  if (!isDesktop) {
    return (
      <Box 
      className="rightpart" 
      sx={{ 
        position: "absolute",
        background: "-webkit-linear-gradient(to left, #8f94fb, #4e54c8)",
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
              // border: '2px groove black', 
              borderRadius: 5,
              display: "flex",
              justifyContent:"center",
              alignItems:"center",
            }}>  
            <Box sx={{ display:"flex", flexDirection: "column", alignItems:"center"}}>

              {/* 게임 페이지 */}
              <Typography variant="h1" sx={{ fontSize: { xs:25, sm:28, md:32, lg:39, xl:39 }, fontWeight: "bold" }}>게임 페이지</Typography>
              
              {/* 게임 프로필 */}
              <Box sx={{  }}>
                <Card sx={{ width:"250px", height: "350px", display: 'grid', placeItems: 'center' }}>
                  <Image src="/MainPage/myLevel.png" alt="button food" width={200} height={200} />
                </Card>                  
              </Box>

              {/* 게임 시작 버튼 */}
              <Button variant="contained" onClick={GameStartButton} sx={{ marginTop: "20px", width: "200px", height: "50px", fontSize: { xs:17, sm:19, md:21, lg:23, xl:25 }  }}>게임 시작</Button>
            </Box>
          </Card>
        </Container>
      </Box>  
    )  
  }

  return (
    <Box 
      className="rightpart" 
      sx={{ 
        position: "absolute",
        background: "-webkit-linear-gradient(to left, #8f94fb, #4e54c8)",
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
              // border: '2px groove black', 
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
                <Box sx={{  }}>
                  <Card sx={{ width:"250px", height: "350px", display: 'grid', placeItems: 'center' }}>
                    <Image src="/MainPage/myLevel.png" alt="button food" width={200} height={200} />
                  </Card>                  
                </Box>

                {/* 게임 시작 버튼 */}
                <Button variant="contained" onClick={GameStartButton} sx={{ marginTop: "20px", width: "200px", height: "50px", fontSize: { xs:17, sm:19, md:21, lg:23, xl:25 }  }}>게임 시작</Button>
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