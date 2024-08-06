import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";


export default function useConnect() {
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    clientRef.current = new Client({
      brokerURL: `${process.env.NEXT_PUBLIC_BACKSOCKET}/game`,
      connectHeaders: {
        Authorization: `${sessionStorage.getItem("accessToken")}`
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    clientRef.current.activate()

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate()
      }
    }
  },[clientRef])

  return clientRef
}