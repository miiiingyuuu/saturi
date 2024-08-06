"use client"

import { Input } from "@mui/material";
import { IMessage } from "@stomp/stompjs";
import useConnect from "@/hooks/useConnect";
import { RoomIdProps } from "@/utils/props";
import { useEffect, useState } from "react";
import { handleValueChange } from "@/utils/utils";

export default function App({params:{roomId}}: RoomIdProps) {
  const clientRef = useConnect()
  const [ message, setMessage ] = useState("")
  const [ quizzes, setQuizzes ] = useState([])

  useEffect(() => {
    const client = clientRef.current
    if (client) {
      const onConnect = () => {
        // 퀴즈 주세요 -> 이거는 어디로 돌아오나요 ?
        client.publish({
          destination: "/pub/room",
          body: JSON.stringify({
            chatType: "QUIZ",
            roomId
          }),
          headers: {
            Authorization: sessionStorage.getItem("accessToken") as string,
          },
        })
        // 입장
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
        // 퀴즈 받았어요
        client.subscribe(`/sub/room/${roomId}`, (message: IMessage) => {
          const body = JSON.parse(message.body)
          setQuizzes(body)
        })

        // 채팅방 접속
        client.subscribe(`/sub/chat/${roomId}`, (message: IMessage) => {
          const body = JSON.parse(message.body)
          console.log(message)
          console.log(body)
        })
      }
      
      

      client.onConnect = onConnect
      if (client.connected) {
        onConnect()
      }
    }
  }, [roomId, clientRef]);

  function sendMessage() {
    if (message.trim() && clientRef.current) {
      clientRef.current.publish({
        destination: "/pub/chat",
        body: JSON.stringify({
          quizId: 1,
          message,
          roomId
        }),
        headers: {
          Authorization: sessionStorage.getItem("accessToken") as string,
        },
      })
      setMessage("")
    }
  }

  return (
    <div>
      <div>여기서 게임 소켓 처리</div>
      <Input
        type="text"
        value={message}
        onChange={event => handleValueChange(event,setMessage)}
        onKeyDown={e => {
          if (e.key === "Enter") sendMessage()
        }}
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  )

}

/*
여기서는 소켓 통신을 하면서 게임을 처리할 예정
1. 여기로 이동했다는건 대기열이 끝나고 게임 방으로 왔다는 뜻
1-1. 게임 방으로 모든 사람들이 한번에 초대 되었을 것이기 때문에, 초대되면서 바로 문제 뽑아오기
> 이러면 각자에게 랜덤 함수로 주어지는지, 특정 문제를 백엔드에서 랜덤으로 뽑은 뒤에 클라에 뿌리는지 모르겠긴 함
1-2.
2. 어느정도 타임아웃을 둔 다음 게임 시작
2-1 . while 문으로 문제 인덱스를 한칸씩 올리면서
3. 게임을 하면서 발생하는 모든 채팅에 문제 번호, 채팅자 명, 등 담아서 보내기
4. 모든 사람들이 정답이면 ? -> 이거 어떻게 처리하지
4-1. 다음 문제로 바로 넘기고
4-2. 아니면 타이머를 두어서 타이머까지 정답을 못맞추는 경우 넘어가기
누군가 정답을 먼저 맞추고 바로 넘어가는거라면? 그냥 정답자 나오자마자 바로 다음 문제로
> 정답자 메시지가 날라오는가?
 */