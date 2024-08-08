import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import useConfirmLeave from "@/hooks/useConfirmLeave";

export default function useConnect() {
  const clientRef = useRef<Client | null>(null);

  useConfirmLeave(); // 페이지 이탈 확인 훅 호출

  useEffect(() => {
    clientRef.current = new Client({
      brokerURL: `${process.env.NEXT_PUBLIC_BACKSOCKET}/game`,
      connectHeaders: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 1000,
      heartbeatOutgoing: 1000,

      debug: msg => console.log(msg)
    });

    clientRef.current.activate();

    function handleBeforeUnload() {
      const url = new URL(window.location.href);
      if (!url.pathname.startsWith("/game")) {
        if (clientRef.current) {
          clientRef.current.deactivate();
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // 클린업 함수에서 이벤트 핸들러 제거
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  return clientRef;
}
