"use client"

import api from "@/lib/axios";
import { IMessage } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import useConnect from "@/hooks/useConnect";
import { TipsProps, RoomIdProps } from "@/utils/props"
import { useRouter } from "next/navigation"

export default function App({params:{roomId}}: RoomIdProps) {
  const router = useRouter()
  const clientRef = useConnect()
  const [tips, setTips] = useState<TipsProps[]>([]);

  useEffect(() => {
    // 팁 받기
    api.get("game/tip")
      .then(response => {
        setTips(response.data);
      });

    // 대기열 설정
    const client = clientRef.current

    if (client) {
      client.onConnect = () => {
        client.subscribe(`/sub/room-request/${roomId}`, (message: IMessage) => {
          const body = JSON.parse(message.body)
          if (body.matchedroomId) {
            router.push(`/game/in-game/${body.matchedroomId}`)
          }
        })

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
    // 여긴 나중에 캐러샐로 바꾸기
    <div>
    {tips.map(tip => (
        <div key={tip.tipId}>
          {tip.content}
        </div>
      ))
    }
    </div>
  );
}

/*
1. game 시작 버튼을 누름
2. 미리 셋팅된 locationId를 불러와서 대기열에 post 하고, stomp를 통해서 통신 시작
3. 큐가 돌아가고, 큐의 인원이 차면 ws 에서 퀴즈룸 id 발송
4. 퀴즈룸에서 게임 시작
*/
/*
in-game에서 in-queue와 기능 분할하기
 */