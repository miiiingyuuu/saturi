"use client"

import useConnect from "@/hooks/useConnect"
import { useEffect, useState } from "react";
import { handleValueChange } from "@/utils/utils";
import api from "@/lib/axios";

export default function App(roomId: any) {
  const clientRef = useConnect(roomId)
  const [ input, setInput ] = useState("")
  const [ quizzes, setQuizzes ] = useState([])

  useEffect(() => {

    api.get("game/room/{roomId}/quiz")
      .then(response => setQuizzes(response.data))


    const client = clientRef.current
    if (client && client.connected) {
      client.subscribe(`/sub/room-request/${roomId}`, (message: IMessage) => {
        const body = JSON.parse(message.body)
        // 여기로 답 보내주는건가?
        console.log(body)
      })

      // 여기는 채팅 보내는 퍼블리셔
      client.publish({
        destination: `/pub/room-request/${roomId}`,
        body: JSON.stringify({
          message: input,
          quizId: "",
          others: "",
        })
      })
      setInput("")
    }
  }, [roomId, clientRef, input]);

  function sendMessage() {
    if (input.trim() && clientRef.current) {
      clientRef.current.publish({
        destination: `/pub/room-request/${roomId}`,
        body: JSON.stringify({
          message: input,
        })
      })
      setInput("")
    }
  }

  return (
    <div>
      <div>여기서 게임 소켓 처리</div>
      <input
        type="text"
        value={input}
        onChange={event => handleValueChange(event,setInput)}
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