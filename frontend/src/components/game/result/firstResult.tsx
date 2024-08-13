import { Box, Container, Card, Typography, LinearProgress, Button, Avatar } from "@mui/material";
import "@/styles/home/main/mainPage.css";


interface FirstResultProps<T> {
  currentStep : number;
  nextstep : any;
  ranks : T[]
  me: number
}

interface RankProps {
  rank : number
  birdId: number
  nickName: string
  ansCount: number
  earnedExp: number
  exp: number
  user: boolean
}


export default function firstResult({
  currentStep,
  nextstep,
  ranks,
  me
} : FirstResultProps<RankProps>){

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
          <Box sx={{
            
            padding:"3px",      
            borderBottom:"3px solid lightgray",
          }}>
            <Typography 
              variant="h4"
              sx={{
                textAlign:"center",                
                margin: "10px",      
            }}> 당신은 {me}등입니다! </Typography>
          </Box>

          {/* 결과 파트 */}
          <Box 
            sx={{
              height:"520px",
              display:"flex",
              flexDirection:"column",
              justifyContent:"space-around",
          }}>
            { ranks.map((rank: RankProps) => (
              <Card
                className="px-3 py-2 mx-3"
                sx={{
                  minHeight:"104px",
                  display:"flex",
                  justifyContent:"space-around",
                  alignItems:"center",
                  border: "2px solid lightgray",
                  borderRadius:"15px",
                }}>
                {/* 프로필 */}
                <Box
                  sx={{
                    width:"100px",
                    height:"100%",
                    border:"1px",
                    display:"flex",
                    flexDirection:"column",
                    alignItems:"center",
                  }}
                >
                  <Avatar
                    sizes="large"
                    src={rank.birdId ? `/mini_profile/${rank.birdId}.png` : "이미지가 없습니다."}
                    sx={{
                      width:"85px",
                      height:"85px",
                      border:"2px solid lightgray",
                    }}
                  />
                  {/* 닉네임 */}
                  <Box 
                    sx={{
                      marginTop:"1px",
                      // border:"1px solid black"
                    }}> {rank.nickName} 
                  </Box>
                </Box>
                
                {/* 프로그래스바 */}
                <Box
                  className="px-5 flex-grow"
                >
                  <LinearProgress 
                    variant="determinate" 
                    value={rank.ansCount} 
                    color="primary"
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      "& .MuiLinearProgress-bar": {
                            borderRadius: 5, // 진행 바 자체도 둥글게 설정
                        },
                  }}/>
                </Box>
              </Card>
            ))}
          </Box>
        </Card>

        <Button variant="contained" onClick={nextstep} sx={{ marginTop: "10px" }}>
          다음
        </Button>

      </Box>



      


    </Container>
  )
}