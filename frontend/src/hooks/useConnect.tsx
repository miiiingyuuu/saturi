import { useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";


export default function useConnect(roomId: string) {
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    clientRef.current = new Client({
      brokerURL: `${process.env.NEXT_PUBLIC_BACKSOCKET}/game`,
      connectHeaders: {
        Authorization: `${sessionStorage.getItem("accessToken")}`
      },
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log(frame)
        // 뭐 써야함
        clientRef.current?.subscribe(`/sub/room-request/${roomId}`, (message: IMessage) => {
          const body = JSON.parse(message.body);
          console.log(body)
        })
        // 진짜 모르겠음
        clientRef.current?.subscribe(`/game/room/in?location=${roomId}`, (message: IMessage) => {
          const body = JSON.parse(message.body);
          console.log(body)

          if (body.newRoomId) {
            window.location.href = `/game/in-game/${body.newRoomId}`
          }
        })
      },
      onDisconnect: (frame) => {
        console.log("disconnected", frame)
      },
    })
    if (clientRef.current) {
      clientRef.current.activate()
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate()
      }
    }
  },[roomId])

  return clientRef
}