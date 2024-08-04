"use client"

import api from "@/lib/axios";
import { Client, IMessage } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { TipsProps } from "@/utils/props"



export default function App() {
  const clientRef = useRef<Client | null>(null);
  const [tips, setTips] = useState<TipsProps[]>([]);

  function connect(roomId: string) {
    clientRef.current = new Client({
      brokerURL: `wss://i11d104.p.ssafy.io/saturi-api/game`,
      connectHeaders: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
      debug: (str) => console.log(str),
      reconnectDelay: 5000,       // 재연결 간격
      heartbeatIncoming: 4000,    // 서버 -> 클라이언트
      heartbeatOutgoing: 4000,    // 클라이언트 -> 서버
    });
    console.log(clientRef)
    // 대기열에 연결됨
    clientRef.current.onConnect = (frame) => {
      console.log(frame);

      // // 메시지를 받을 토픽을 구독
      // clientRef.current?.subscribe(`/sub/room-request/${roomId}`, (message: IMessage) => {
      //   const body = JSON.parse(message.body);
      //   console.log(body);
      //
      // })

      clientRef.current?.subscribe(`/game/room/in?location=${roomId}`, (message: IMessage) => {
        const body = JSON.parse(message.body);
        console.log(body)

        // 서버로부터 새로운 roomId를 받으면 이동
        if (body.newRoomId) {
          window.location.href = `/game/in-game/${body.newRoomId}`;
        }
      })
    };


    clientRef.current.onWebSocketError = (event) => {
      console.error("WebSocket Error: ", event);
    };

    clientRef.current.onStompError = (frame) => {
      console.error(frame.headers.message);
      console.error(frame.body);
    };

    clientRef.current.activate();
  }

  useEffect(() => {
    // 팁 받기
    api.get("game/tip")
      .then(response => {
        setTips(response.data);
        console.log(tips)
      });

    // 대기열에 들어가기
    api.post("game/room/in", { locationId: 1 })
      .then(response => {
        connect(response.data.roomId);
      })
      .catch(error => console.error(error));
  }, []);

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
