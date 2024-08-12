"use client";

import { Box, Container, Typography, Card, LinearProgress, Button } from "@mui/material";
import {useEffect, useState} from "react";
import api from "@/lib/axios";
import {RoomIdProps} from "@/utils/props";
import FirstResult from "@/components/game/result/firstResult";
import SecondResult from "@/components/game/result/secondResult";


export default function Result({ params: { roomId } }: RoomIdProps) {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null); // Initialize as null
    const [currentStep, setCurrentStep] = useState(1);


    const nextstep = () => {
        if (currentStep === 1){
            setCurrentStep(currentStep + 1);
        }        
      };


    useEffect(() => {
        api.post("/game/result", {
            roomId
        })
            .then(response => {
                // 여기에 결과 정보 담아서 옴
                console.log(response)
            })
    }, []);

    // 프로필 받아오기 
    // useEffect(() => {
    //     api
    //         .put(`learn/lesson-group-result/${lessonGroupResultId}`)
    //         .then((res) => {
    //         if (res.status === 200) {
    //             console.log("lessonGroupResult", res.data);
    //             setUserInfo(res.data.userInfo);
    //         }
    //         })
    //         .catch((err) => {
    //         console.log(err);
    //         });
    // }, []); // lessonGroupResultId가 변경될 때마다 실행




    return(

        <Container 
            maxWidth="lg" 
            sx={{                
                height:"90vh",
                minHeight:"700px",
        }}>
            <FirstResult
                currentStep = {currentStep}
                nextstep = {nextstep}
            />
            <SecondResult
                currentStep = {currentStep}
            />
        </Container>





        




    )

}