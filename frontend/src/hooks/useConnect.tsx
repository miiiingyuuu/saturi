import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import useConfirmLeave from "@/hooks/useConfirmLeave"; // 경로를 실제 파일 위치로 변경하세요

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
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    clientRef.current.activate();

    function handleBeforeUnload () {
      const url = new URL(window.location.href);
      if (url.pathname === "/specific-url") { // "/specific-url"을 실제 특정 URL로 변경하세요
        if (clientRef.current) {
          clientRef.current.deactivate();
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return clientRef;
}
