"use client";

import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RoomIdProps } from "@/utils/props";
import { Backdrop, Box, CircularProgress, Container } from "@mui/material";
import FirstResult from "@/components/game/result/firstResult";
import SecondResult from "@/components/game/result/secondResult";

interface RankProps {
  rank: number;
  birdId: number;
  nickName: string;
  ansCount: number;
  earnedExp: number;
  exp: number;
  user: boolean;
}

export default function Result({ params: { roomId } }: RoomIdProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [ranks, setRanks] = useState<RankProps[]>([]);
  const [me, setMe] = useState(0);
  const [myRank, setMyRank] = useState<RankProps>({
    rank: 0,
    birdId: 0,
    nickName: '',
    ansCount: 0,
    earnedExp: 0,
    exp: 0,
    user: false,
  });
  const [allowApiCall, setAllowApiCall] = useState(false); // API 호출 여부
  const router = useRouter();

  const nextstep = () => {
    if (currentStep === 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  useEffect(() => {
    // 이전 페이지가 없거나, 직접 URL을 입력했는지 확인 (document.referrer가 없으면 직접 입력한 것으로 간주)
    if (!sessionStorage.getItem("success")) {
      // 직접 URL을 입력했을 경우 리다이렉트
      router.replace("/"); // 홈 페이지나 원하는 경로로 리다이렉트
    } else {
      // 정상적인 클라이언트 내비게이션이 발생한 경우에만 API 호출 허용
      setAllowApiCall(true);
      sessionStorage.removeItem("success");
    }
  }, [router]);

  useEffect(() => {
    if (allowApiCall) {
      api
        .post("/game/result", {
          roomId,
        })
        .then((response) => {
          setRanks(response.data);
          const myRankData = response.data.find((rank: RankProps) => rank.user);
          setMyRank(myRankData);
          setMe(myRankData.rank);
        });
    }
  }, [allowApiCall, roomId]);
  if (!allowApiCall) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }
  return (
    <Box
      style={{
        position: "relative",
        overflow: "hidden",
        height: "90vh",
        width: "100%",
        minHeight: "700px",
      }}
    >
      <Container maxWidth="lg">
        <FirstResult currentStep={currentStep} nextstep={nextstep} ranks={ranks} me={me} />
        <SecondResult currentStep={currentStep} myRank={myRank} />
      </Container>
    </Box>
  );
}
