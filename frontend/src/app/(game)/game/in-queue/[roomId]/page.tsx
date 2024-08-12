"use client"


import { IMessage } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import useConnect from "@/hooks/useConnect";
import { RoomIdProps } from "@/utils/props"
import { useRouter } from "next/navigation"
import { Backdrop, CircularProgress } from "@mui/material";

export default function App({params:{roomId}}: RoomIdProps) {
  const router = useRouter()
  const clientRef = useConnect()

  // 대기열 설정
  useEffect(() => {
    const client = clientRef.current
    if (client) {
      client.onConnect = () => {
        const subscription = client.subscribe(`/sub/room-request/${roomId}`, (message: IMessage) => {
          const body = JSON.parse(message.body);
          if (body.matchedroomId) {
            // 구독 해제
            subscription.unsubscribe();
            // 페이지 이동
            router.replace(`/game/in-game/${body.matchedroomId}`)
          }
        });

        client.publish({
          destination: "/pub/room",
          body: JSON.stringify({
            chatType: "ENTER",
            roomId
          }),
          headers: {
            Authorization: sessionStorage.getItem("accessToken") as string,
          },
        })

        client.publish({
          destination: "/pub/room-request",
          body: JSON.stringify({
            chatType: "ROOM",
            roomId,
            locationId: 2,
          }),
          headers: {
            Authorization: sessionStorage.getItem("accessToken") as string,
          },
        })
      }
    }
  }, [clientRef, roomId]);

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
      open
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}