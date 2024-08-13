import { Box, Container, Card, LinearProgress, Button, Typography } from "@mui/material";
import { useRouter } from 'next/navigation';
import "@/styles/home/main/mainPage.css";


interface SecondResultProps<T> {
  currentStep : number;
  myRank: T
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

export default function SecondResult({
  currentStep,
  myRank
}: SecondResultProps<RankProps>) {

  // 마음대로 변경 가능
  const progress = 50
  const router = useRouter();
  const { rank, birdId, nickName, ansCount, earnedExp, exp, user } = myRank



  // 티어 이미지 파트
  const tierImages = {
    stone: "/tier/stone1.gif",
    bronze: "/tier/bronze1.gif",
    silver: "/tier/silver1.gif",
    gold: "/tier/gold1.gif",
    sapphire: "/tier/sapphire1.gif",
    platinum: "/tier/platinum1.gif",
    diamond: "/tier/diamond1.gif",
  };
  type TierKey = keyof typeof tierImages;
  const getTierFromExp = (exp: number): TierKey => {
    if (exp === 0) return "stone";
    if (exp < 100) return "bronze";
    if (exp < 500) return "silver";
    if (exp < 1500) return "gold";
    if (exp < 3000) return "platinum";
    if (exp < 5000) return "sapphire";
    return "diamond";
  };
  const tierKey = getTierFromExp( exp+earnedExp );
  const imageSrc = tierImages[tierKey];


  const handleAgain = () => {
    //지역값을 받아와서 router.push를 해야 할 것 같은데 
  }

  const handleHome = () => {
    router.push(
      `/main`
    );
  }


  return(
    <Container
      className="tmp2"
      maxWidth="lg"
      style={{
          height: "90vh",
          minHeight: "700px",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          flexDirection:"column",
          left: (() => {
            if (currentStep === 1) {
              return "150%";
            } if (currentStep === 2) {
              return "50%";
            } return "0%";              
          })()
      }}>

        {/* 첫 번째 라인 */}
        <Card
            sx= {{
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
              padding:"15px",
              paddingX:"20px",
              margin:"5px",
              borderRadius:"15px",
            }}>
            {/* 1의 1 */}
            <Box
                sx={{
                    width:"100px",
                    height:"100px",
                }}>
                <Box
                    component="img"
                    src = {myRank? imageSrc : undefined }
                    alt = "profile"
                    sx={{
                        width:"100px"
                    }}/>
            </Box>
            {/* 1의 2 */}
            <Box>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    className="pb-4 m-10"
                    aria-label="progress bar"
                    sx={{
                        width: "550px",
                        height: 8, // 원하는 높이로 설정
                        borderRadius: 5, // 테두리를 둥글게 설정
                        "& .MuiLinearProgress-bar": {
                            borderRadius: 5, // 진행 바 자체도 둥글게 설정
                        },
                    }}
                />
            </Box>
            {/* 1의 3 */}
            <Typography
              sx={{
              textAlign:"center",
            }}>
              +{earnedExp} Exp
            </Typography>

        </Card>

        {/* 두 번째 라인 */}
        <Box
            sx= {{
                display:"flex",
                justifyContent:"center",
            }}>
            <Box
              sx={{
                width: "350px",
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}>
                <Button
                  className="mt-4 bg-green-500 text-white px-8 py-4 rounded"
                  variant="contained"
                  onClick={handleAgain}
                  sx={{
                    backgroundColor:"success.light",
                    '&:hover': { backgroundColor: 'green' },
                    '&:active': { backgroundColor: 'green' },
                    '&:focus': { backgroundColor: 'success' },
                }}>
                  다시하기
                </Button>
                <Button
                  className="mt-4 bg-green-500 text-white px-8 py-4 rounded"
                  variant="contained"
                  onClick={handleHome}
                  sx={{
                    backgroundColor:"success.light",
                    '&:hover': { backgroundColor: 'green' },
                    '&:active': { backgroundColor: 'green' },
                    '&:focus': { backgroundColor: 'success' },
                }}>
                  처음으로
                </Button>
            </Box>


        </Box>
    </Container>
  )
}





































// interface SecondResultProps {
//   // lessonGroupResult: LessonGroupResultProps;
//   userInfo: UserInfo;
//   // currentStep : number;
//   // beforestep : any;
// }



// export default function SecondResult({
//   // lessonGroupResult,
//   userInfo,
//   // currentStep,
//   // beforestep,
// }:SecondResultProps) {

//   // 마음대로 변경 가능
//   const progress = 50




  

//   // 이미지 경로가 public 폴더 아래에 있어야 함
//   const tierImages = {
//     stone: "/tier/stone1.gif",
//     bronze: "/tier/bronze1.gif",
//     silver: "/tier/silver1.gif",
//     gold: "/tier/gold1.gif",
//     sapphire: "/tier/sapphire1.gif",
//     platinum: "/tier/platinum1.gif",
//     diamond: "/tier/diamond1.gif",
//   };
//   type TierKey = keyof typeof tierImages;
//   const getTierFromExp = (exp: number): TierKey => {
//     if (exp === 0) return "stone";
//     if (exp < 100) return "bronze";
//     if (exp < 500) return "silver";
//     if (exp < 1500) return "gold";
//     if (exp < 3000) return "platinum";
//     if (exp < 5000) return "sapphire";
//     return "diamond";
//   };

//   const tierKey = getTierFromExp(userInfo.resultExp);
//   const imageSrc = tierImages[tierKey];




//   return(
//     <Container
//         maxWidth="lg"
//         sx={{
//             height: "90vh",
//             minHeight: "700px",
//             display:"flex",
//             justifyContent:"center",
//             flexDirection:"column",
//         }}>

//         {/* 첫 번째 라인 */}
//         <Box
//             sx= {{
//                 display:"flex",
//                 justifyContent:"center",
//             }}>
//             {/* 1의 1 */}
//             <Card
//                 sx={{
//                     width:"100px",
//                     height:"100px",
//                 }}>
//                 <Box
//                     component="img"
//                     src = "/btnG_아이콘원형.png"
//                     alt = "profile"
//                     sx={{
//                         width:"100px"
//                     }}/>
//             </Card>
//             {/* 1의 2 */}
//             <Box>
//                 <LinearProgress
//                     variant="determinate"
//                     value={progress}
//                     className="pb-4 m-10"
//                     aria-label="progress bar"
//                     sx={{
//                         width: "550px",
//                         height: 8, // 원하는 높이로 설정
//                         borderRadius: 5, // 테두리를 둥글게 설정
//                         "& .MuiLinearProgress-bar": {
//                             borderRadius: 5, // 진행 바 자체도 둥글게 설정
//                         },
//                     }}
//                 />
//             </Box>
//             {/* 1의 3 */}
//             {/* <Typography
//       sx={{
//         position: "absolute",
//         right:"5px"
//     }}>
//       50+
//     </Typography> */}
//         </Box>

//         {/* 두 번째 라인 */}
//         <Box
//             sx= {{
//                 display:"flex",
//                 justifyContent:"center",
//             }}>
//             <Box
//                 sx={{
//                     width: "350px",
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginTop: "20px",
//                 }}>
//                 <Button variant="contained"> 다시하기 </Button>
//                 <Button variant="contained"> 처음으로 </Button>
//             </Box>


//         </Box>
//     </Container>
//   )
// }