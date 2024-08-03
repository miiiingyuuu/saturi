"use client"


import { Client } from "@stomp/stompjs"
import { useRef, useState } from "react";
import { Button } from "@mui/material";

export default function App() {
  const clientRef = useRef<Client | null>()
  const [ isConnected, setIsConnected ] = useState(false)

  // 연결
  function connect() {
    clientRef.current = new Client({
      brokerURL: `${process.env.NEXT_PUBLIC_BACKSOCKET}/chat`,
      connectHeaders: {
        login: "guest",
        password: "guest"
      },
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,             // 재연결 간격
      heartbeatIncoming: 4000,          // 서버 -> 클라
      heartbeatOutgoing: 4000,          // 클라 -> 서버
    })

    // 연결 성공 시
    clientRef.current.onConnect = (frame) => {
      console.log(`Connected: ${frame}`)
      setIsConnected(true)

      // 특정 주제 구독
      clientRef.current?.subscribe("/sub/game/room-request", message => {
        console.log(`Received: ${message.body}`)
      })
    }

    // 소켓 연결 중 에러 발생 시
    clientRef.current.onStompError = (frame) => {
      console.log(frame.headers.message)
      console.log(frame.body)
    }

    // 활성화
    clientRef.current.activate()
  }

  // 연결 해제
  function disconnect() {
    if (clientRef.current) {
      clientRef.current.deactivate()
        .then(() => setIsConnected(false));
    }
    console.log("ㅂㅂ")
  }

  // 소켓 메시지 통신
  function sendMessage() {
    if (clientRef.current && clientRef.current.connected) {
      const message = JSON.stringify({
        type: 'ENTER',
        roomId: '49ad2e0f-2d98-4bca-9b35-6cdcd30a3838',
        senderId: 3,
        message: '정답!!!! 3번',
      })

      clientRef.current.publish({
        destination: "pub/game/room-request",
        body: message,
      })
    } else {
      console.error("오류")
    }
  }

  return (
    <div>
      <h1>STOMP WebSocket Example</h1>
      <Button onClick={connect} disabled={isConnected}>Connect</Button>
      <Button onClick={disconnect} disabled={!isConnected}>Disconnect</Button>
      <Button onClick={sendMessage} disabled={!isConnected}>Send Message</Button>
    </div>
  )
}
