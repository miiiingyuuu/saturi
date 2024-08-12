import { Box, Container, Card, Typography, LinearProgress, Button } from "@mui/material";
import "@/styles/home/main/mainPage.css";


interface FirstResultProps {
  currentStep : number;
  nextstep : any;
}


export default function firstResult({
  currentStep,
  nextstep,
} : FirstResultProps){
  return(
    <Container
      className="tmp"
      maxWidth="lg"
      style={{
        height:"90vh",
        display:"flex",
        justifyContent:"center",
        flexDirection:"column",
        overflow: 'hidden',
        left: (() => {
          if (currentStep === 1) {
            return "50%";
          } if (currentStep === 2) {
            return "-50%";
          } return "0%";              
      })()
    }}>
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          margin: "10px",
        }}>
        <Card
          sx = {{
            width: "700px",
            minHeight: "560px",
          }}>
          <Box sx={{margin: "10px"}}>
            <Typography 
              variant="h3"
              sx={{
                textAlign:"center",
            }}> 당신은 1등입니다! </Typography>
          </Box>

          {/* 결과 파트 */}
          <Box 
            sx={{
              height:"520px",
              display:"flex",
              flexDirection:"column",
              justifyContent:"space-around",
          }}>
            {/* 1번째 */}
            <Box 
              className="px-3 py-2"
              sx={{
                minHeight:"104px",
                display:"flex",
                justifyContent:"space-around",
                alignItems:"center",
            }}>
              <Box sx={{border:"1px solid black"}}> profile </Box>
              <Box 
                sx={{
                  width:"85%",
                  height:"100%",
              }}>
                <LinearProgress variant="determinate" value={20} />
              </Box>
            </Box>

            {/* 2번째 */}
            <Box 
              className="px-3 py-2"
              sx={{
                minHeight:"104px",
                display:"flex",
                justifyContent:"space-around",
                alignItems:"center",
            }}>
              <Box sx={{border:"1px solid black"}}> profile </Box>
              <Box 
                sx={{
                  width:"85%",
                  height:"100%",
              }}>
                <LinearProgress variant="determinate" value={20} />
              </Box>
            </Box>

            {/* 3번째 */}
            <Box 
              className="px-3 py-2"
              sx={{
                minHeight:"104px",
                display:"flex",
                justifyContent:"space-around",
                alignItems:"center",
            }}>
              <Box sx={{border:"1px solid black"}}> profile </Box>
              <Box 
                sx={{
                  width:"85%",
                  height:"100%",
              }}>
                <LinearProgress variant="determinate" value={20} />
              </Box>
            </Box>

            {/* 4번째 */}
            <Box 
              className="px-3 py-2"
              sx={{
                minHeight:"104px",
                display:"flex",
                justifyContent:"space-around",
                alignItems:"center",
            }}>
              <Box sx={{border:"1px solid black"}}> profile </Box>
              <Box 
                sx={{
                  width:"85%",
                  height:"100%",
              }}>
                <LinearProgress variant="determinate" value={20} />
              </Box>
            </Box>

            {/* 5번째 */}
            <Box 
              className="px-3 py-2"
              sx={{
                minHeight:"104px",
                display:"flex",
                justifyContent:"space-around",
                alignItems:"center",
            }}>
              <Box sx={{border:"1px solid black"}}> profile </Box>
              <Box 
                sx={{
                  width:"85%",
                  height:"100%",
              }}>
                <LinearProgress variant="determinate" value={20} />
              </Box>
            </Box>
          </Box>


        </Card>
        <Button variant="contained" onClick={nextstep} sx={{ marginTop: "10px" }}>
          다음
        </Button>
      </Box>



      


    </Container>
  )
}