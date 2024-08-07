"use client";

import { Box, Container, Typography, Card, LinearProgress, Button } from "@mui/material";
import {useEffect, useState} from "react";
import api from "@/lib/axios";
import {RoomIdProps} from "@/utils/props";


export default function Result({ params: { roomId } }: RoomIdProps) {
    // 마음대로 변경 가능
    const progress = 50

    useEffect(() => {
        api.post("/game/result", {
            roomId
        })
            .then(response => {
                // 여기에 결과 정보 담아서 옴
                console.log(response)
            })
    }, []);

    return(



        <Container
            maxWidth="lg"
            sx={{
                height: "700px",
                display:"flex",
                justifyContent:"center",
                flexDirection:"column",
            }}>

            {/* 첫 번째 라인 */}
            <Box
                sx= {{
                    display:"flex",
                    justifyContent:"center",
                }}>
                {/* 1의 1 */}
                <Card
                    sx={{
                        width:"100px",
                        height:"100px",
                    }}>
                    <Box
                        component="img"
                        src = "/btnG_아이콘원형.png"
                        alt = "profile"
                        sx={{
                            width:"100px"
                        }}/>
                </Card>
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
                {/* <Typography
          sx={{
            position: "absolute",
            right:"5px"
        }}>
          50+
        </Typography> */}
            </Box>

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
                    <Button variant="contained"> 다시하기 </Button>
                    <Button variant="contained"> 처음으로 </Button>
                </Box>


            </Box>
        </Container>


        // <Container
        //   maxWidth="lg"
        //   sx={{
        //     display:"flex",
        //     justifyContent:"center",
        //     flexDirection:"column",
        // }}>

        //   첫번째 라인
        //   <Card
        //     sx={{
        //       display: "flex",
        //       justifyContent: "center",
        //       alignItems: "center",
        //       width:"900px",
        //       height:"500px",
        //   }}>
        //     <Card
        //     sx={{
        //       width:"100px",
        //       height:"100px",
        //     }}>
        //       <Typography
        //       sx={{
        //         textAlign:"center",
        //       }}>
        //         우승했습니다.
        //       </Typography>
        //     </Card>
        //     <Box>
        //     <LinearProgress
        //       variant="determinate"
        //       value={progress}
        //       className="pb-4 m-10"
        //       aria-label="progress bar"
        //       sx={{
        //         width: "300px",
        //         height: 8, // 원하는 높이로 설정
        //         borderRadius: 5, // 테두리를 둥글게 설정
        //         "& .MuiLinearProgress-bar": {
        //           borderRadius: 5, // 진행 바 자체도 둥글게 설정
        //         },
        //       }}
        //     />
        //     </Box>

        //   </Card>

        //   {/* 두 번쨰 라인 */}
        //   <Box
        //     sx={{
        //       display: "flex",
        //       justifyContent: "space-between",
        //   }}>
        //     <Button> 다시하기 </Button>
        //     <Button> 처음으로 </Button>
        //   </Box>


        // </Container>




    )

}