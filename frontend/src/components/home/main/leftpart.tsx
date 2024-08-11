import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Card, ButtonBase, Typography, useMediaQuery, Container, Grid } from '@mui/material';
import { LeftPartProps } from "@/utils/props";


export default function LeftPart({ middlePosition, moveDirection, selectedRegion }: LeftPartProps) {
  const router = useRouter();

  // TODO: middlePosition 검사 변경
  useEffect(() => {
    if (middlePosition === 3) {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
          if (audioInputDevices.length > 0) {
            navigator.mediaDevices.getUserMedia({ audio: true })
              .then(() => {
                // 마이크 허용됨
              })
              .catch((error) => {
                // eslint-disable-next-line no-console
                console.error('마이크 허용 오류:', error);
              });
          } else {
            // eslint-disable-next-line no-console
            console.error('사용 가능한 오디오 입력 장치가 없습니다.');
          }
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('장치 나열 오류:', error);
        });
    }
  }, [middlePosition]);

  function buttonLearn(num: number) {
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
    router.push(`/lesson/${region}/${num}`);
  }



  return (    
    <Box
      className="leftpart"
      style={{
        zIndex: (() => {
          if (middlePosition === 0) {
            return 0;
          } 
          if (middlePosition === 1) {
            return moveDirection === "right" ? 2 : 0;
          }
          if (middlePosition === 2) {
            return 2;
          }
          return 0;
        })(),
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
            // border: '2px groove', 
            borderRadius: 5,
            display: "flex",
            alignItems:"center",
          }}>
          <Grid container spacing={0}>
            <Grid 
              item 
              xs={12} 
              md={6} 
              sx={{
                display: "flex",
                justifyContent: "center",
              }}>
              <Box 
                sx={{
                  width: "370px",
                  minHeight: "500px",
                  display:"flex",
                  flexDirection:"column",
                  justifyContent:"center",
              }}>
                <Typography variant="h1" sx={{ fontSize: 39, fontWeight: "bold" }}>학습 페이지</Typography>
                <br />
                <Card sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, border: '3px solid lightgray', borderRadius: 5, padding:"15px" }}>                  
                  <ButtonBase onClick={() => { buttonLearn(1) }} sx={{ width: '100%', height: "100%", borderRadius: "15px"}}>
                    <Box component="img" src="/MainPage/learnButton1.png" alt="" sx={{width: '100%', height: '100%', objectFit: 'cover' }} />
                  </ButtonBase>
                  <ButtonBase onClick={() => { buttonLearn(2) }} sx={{ width: '100%', height: "100%", borderRadius: "15px"}}>
                    <Box component="img" src="/MainPage/learnButton2.png" alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </ButtonBase>
                  <ButtonBase onClick={() => { buttonLearn(3) }} sx={{ width: '100%', height: "100%", borderRadius: "15px"}}>
                    <Box component="img" src="/MainPage/learnButton3.png" alt="" sx={{width: '100%', height: '100%', objectFit: 'cover' }} />
                  </ButtonBase>
                  <ButtonBase onClick={() => { buttonLearn(4) }} sx={{ width: '100%', height: "100%", borderRadius: "15px"}}>
                    <Box 
                      component="img"
                      src={selectedRegion !== "경기도" ? "/MainPage/learnButton4.png" : "/MainPage/learnButton5.png"}
                      alt=""
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </ButtonBase>
                </Card>
              </Box>  
            </Grid>
            <Grid item xs={12} md={6}/>
          </Grid>
          
        </Card>   
      </Container>       
    </Box>







    






      // <Box
      //   className="leftpart"
      //   style={{
      //     zIndex: (() => {
      //       if (middlePosition === 0) {
      //         return 0;
      //       } 
      //       if (middlePosition === 1) {
      //         return moveDirection === "right" ? 2 : 0;
      //       }
      //       if (middlePosition === 2) {
      //         return 2;
      //       }
      //       return 0;
      //     })()
      //   }}>
      //   <Box sx={{ display: 'grid', placeItems: 'center', height: '85vh' }}>
      //     <Card sx={{ width: "100%", height:"75vh", border: '2px solid black', borderRadius: 5, top:"-50%", backgroundColor: "whitesmoke" }} />
      //   </Box>
        
      // </Box>









  );
}
