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
        }}>
        <Card
          sx = {{
            aspectRatio: "1.1 / 1",
            height: "75vh",
            minHeight: "560px",
            borderRadius: "15px",
          }}>
          {/* 등수 표시 */}
          <Box sx={{
            height:"10%",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            borderBottom:"3px solid lightgray",      
            padding:"3px",
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
              overflow:"hidden",
              height:"90%",
              display:"flex",
              flexDirection:"column",
              justifyContent:"space-around",
          }}>
            { ranks.map((rank: RankProps) => (
              <Card
                className="px-3 py-2 mx-3"
                sx={{
                  height:"16%",
                  minHeight:"80px",
                  display:"flex",
                  justifyContent:"space-around",
                  alignItems:"center",
                  border: "2px solid lightgray",
                  borderRadius:"15px",
                  marginY:"5px",
                }}>
                {/* 프로필 */}
                <Box
                  sx={{
                    width:"100px",
                    height:"100%",
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"space-around",
                    alignItems:"center",
                  }}
                >
                  <Avatar
                    sizes="large"
                    src={rank.birdId ? `/mini_profile/${rank.birdId}.png` : "이미지가 없습니다."}
                    sx={{                      
                      border:"2px solid lightgray",
                    }}
                  />
                  {/* 닉네임 */}
                  <Box 
                    sx={{
                      paddingTop:"1px",
                      height:"20%",

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
                    value={rank.ansCount * 10 }
                    color="primary"
                    sx={{
                      height: 12,
                      borderRadius: 5,
                      "& .MuiLinearProgress-bar": {
                            borderRadius: 5, // 진행 바 자체도 둥글게 설정
                        },
                  }}/>
                </Box>
                <Typography 
                  sx={{
                    paddingX:"5px",
                }}>
                  {rank.ansCount} / 10
                </Typography>
              </Card>
            ))}
          </Box>
        </Card>

        <Button
          className="mt-4 bg-green-500 text-white px-8 py-4 rounded"
          variant="contained"
          onClick={nextstep}
          sx={{
            marginTop: "10px",
            backgroundColor:"success.light",
            '&:hover': { backgroundColor: 'green' },
            '&:active': { backgroundColor: 'green' },
            '&:focus': { backgroundColor: 'success' },
          }}>
          다음
        </Button>

      </Box>



      


    </Container>
  )
}