"use client"

import { IMessage } from "@stomp/stompjs";
import useConnect from "@/hooks/useConnect";
import SendIcon from "@mui/icons-material/Send";
import { handleValueChange } from "@/utils/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { GameQuizChoiceProps, GameQuizProps, MessagesProps, RoomIdProps, ParticipantsProps } from "@/utils/props";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Card,
  ToggleButton,
  ToggleButtonGroup,
  Container,
} from "@mui/material";
import { getCookie } from "cookies-next";
import useConfirmLeave from "@/hooks/useConfirmLeave";
import { useRouter } from "next/navigation"
import { styled } from "@mui/material/styles"
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import api from "@/lib/axios";

type IsClickedState = {
  [key: number]: boolean;
};

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: '20px', // 원하는 폰트 사이즈로 변경
  },
});

export default function App({ params: { roomId } }: RoomIdProps) {
  const you = getCookie("nickname");
  const router = useRouter()
  const clientRef = useConnect();
  const [now, setNow] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessagesProps[]>([]);
  const [quizzes, setQuizzes] = useState<GameQuizProps<GameQuizChoiceProps>[]>([]);
  const [nowQuiz, setNowQuiz] = useState<GameQuizProps<GameQuizChoiceProps>>();
  const [isAnswerTime, setIsAnswerTime] = useState(false);
  const [result, setResult] = useState("틀렸습니다!");
  const [time, setTime] = useState(10);
  const [isStart, setIsStart] = useState(false);
  const [participants, setParticipants] = useState<ParticipantsProps[]>([]);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [highlightedNick, setHighlightedNick] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState<IsClickedState>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  function updateParticipantMessage(nickName: string, message: string) {
    setParticipants((prevParticipants) =>
      prevParticipants.map((participant) =>
        participant.nickName === nickName
          ? { ...participant, latestMessage: message }
          : participant
      )
    );
  }

  function reportChat(chatLogId: number) {
    api.post(`/game/user/${chatLogId}`)
        .then(() => {
          setIsClicked(prev => ({...prev, [chatLogId]: true}))
          alert("신고 완료되었습니다.")
        })
  }

  function showTooltip() {
    setTooltipOpen(true);
    setTimeout(() => setTooltipOpen(false), 3000); // 3초 후 Tooltip 닫기
  }

  function sendMessage(message: string) {
    if (message.trim() && clientRef.current) {
      clientRef.current.publish({
        destination: "/pub/chat",
        body: JSON.stringify({
          // 메시지를 보낼 때, 대기 시간이 지나지 않았거나, 퀴즈 번호가 없는 경우 기본값인 1로 quizId를 전송한다.
          quizId: (time===0)&&nowQuiz?.quizId || 1 ,
          message,
          roomId,
        }),
        headers: {
          Authorization: sessionStorage.getItem("accessToken") as string,
        },
      });
    }
    setMessage("");
  }

  // 잔여 인원 수
  const remainCount = useMemo(() =>
    participants?.filter(participant => !participant.isExited).length
  , [participants])
  // 잔여 인원 수를 세어 방에 2명 이상이 있었다가, 1명만 남은 경우 방을 폭파시킨다.

  useEffect(() => {
    const client = clientRef.current;
    if (participants?.length>1 && remainCount===1) {
      client?.publish({
        destination: "/pub/room",
        body: JSON.stringify({
          chatType: "TERMINATED",
          roomId,
        }),
        headers: {
          Authorization : sessionStorage.getItem("accessToken") as string
        }
      })
      alert("인원이 부족해 게임이 종료되었습니다. \n 메인 화면으로 되돌아갑니다.")
      router.replace("/")
    }
  }, [remainCount]);

  // now(현재 문제 번호)가 바뀔때마다 quizzes 배열에서 문제를 갱신하고,
  // 문제 번호가 10인 경우(마지막 문제까지 다 푼 경우) 게임을 종료시킨다.
  useEffect(() => {
    if (Array.isArray(quizzes)) {
      const data = quizzes[now];
      setNowQuiz(data);
    }
    if (now === 10) {
      clientRef.current?.publish({
        destination: "/pub/room",
        body: JSON.stringify({
          chatType: "END",
          roomId
        }),
        headers : {
          Authorization: sessionStorage.getItem("accessToken") as string,
        }
      })
      setIsAnswerTime(true);
      setResult("문제를 모두 풀었습니다. \n 잠시 후 결과페이지로 이동합니다.")
      setTimeout(() => {
        router.push(`/game/in-game/${roomId}/result`)
      },3000)
    }
  }, [quizzes, now]);

  useEffect(() => {
    const client = clientRef.current;
    if (client) {
      const onConnect = () => {
        // 방 정보 구독
        client.subscribe(`/sub/room/${roomId}`, (message: IMessage) => {
          const body = JSON.parse(message.body)
          console.log(body)
          // 바디가 배열의 형태로 주어지는 경우 (퀴즈 전송 시에만 해당)
          if (Array.isArray(body)) {
            setQuizzes(body);
          } else {
            if (!isStart && body.chatType === "START") {
              setIsStart(true)
            }
            setParticipants(body.participants);
          }});

        // 입장
        client.publish({
          destination: "/pub/room",
          body: JSON.stringify({
            chatType: "ENTER",
            roomId,
          }),
          headers: {
            Authorization: sessionStorage.getItem("accessToken") as string,
          },
        });
        // 퀴즈 정보 요청
        console.log(quizzes)
        if (!quizzes.length) {
        client.publish({
          destination: "/pub/room",
          body: JSON.stringify({
            chatType: "QUIZ",
            roomId,
          }),
          headers: {
            Authorization: sessionStorage.getItem("accessToken") as string,
          },
        })}

        // 채팅 구독
        client.subscribe(`/sub/chat/${roomId}`, (message: IMessage) => {
          const body = JSON.parse(message.body);
          console.log(body)
          // 방에서 정답이 나오면
          if (body.correct) {
            // 채팅 관련 정보를 초기화 하고
            setIsSubmitted(false)
            setMessage("")
            // 정답자 축하 타임 ( 이때 꺼짐 )
            setIsAnswerTime(true);

            // 니가 정답자라면
            if (you === body.senderNickName) {
              setResult("정답입니다!");
            } else {
              setResult(`${body.senderNickName}님이 정답을 맞추셨습니다`);
            }
            // 5초 후, 다음 문제로 넘어가기
            setTimeout(() => {
              setIsAnswerTime(false);
              setResult("틀렸습니다!")
              setNow((prev) => prev + 1);
            }, 5000);
          }
          // 시간
          const timestamp = new Date().toLocaleTimeString("ko-KR", {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
          });
          // 메시지 구성 요소
          const newMsg: MessagesProps = {
            timestamp,
            message: body.message,
            nickname: body.senderNickName,
            chatLogId: body.chatLogId
          };
          // 메시지 로그에 뒤에서부터 채워넣고
          setMessages((prevMsg) => [...prevMsg, newMsg]);

          // 말풍선 관련 호출 함수
          setHighlightedNick(body.senderNickName);
          updateParticipantMessage(body.senderNickName, body.message);
          showTooltip();
          setTimeout(() => setHighlightedNick(null), 3000);
        });
      };

      // 게임 종료 시
      const onDisconnect = () => {
        client.publish({
          destination: "/pub/room",
          body: JSON.stringify({
            roomId,
            chatType: "EXIT"
          }),
          headers: {
            Authorization: sessionStorage.getItem("accessToken") as string,
          },
        });
      };

      window.addEventListener("unload", onDisconnect);

      client.onDisconnect = onDisconnect;
      client.onConnect = onConnect;

      if (client.connected) {
        onConnect();
      }
      return () => {
        onDisconnect()
      }
    }
  }, [roomId, clientRef]);

  // 타이머 작동
  useEffect(() => {
    if (time && isStart) {
      setTimeout(() => setTime(time - 1), 1000);
    }
  }, [time, isStart]);

  // 빡종 방지
  useConfirmLeave();
  return (
    <Box>
      <Container maxWidth="lg">
        {/* 게임 파트 */}
        <Box
          sx={{
          height: "90vh",
          minHeight: "600px",
          backgroundImage: "url(/MainPage/background.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "15px",
          border:"3px groove black",
        }}>
          <Box sx={{
            minHeight: "390px",
            height:"70%",

          }}>
            {/* 중요파트 */}
            {!isStart ? (
              <Typography
                component="h1"
                variant="h5"
                sx={{
                  display:"flex",
                  justifyContent:"center",
                  alignItems:"center",
                  height:"100%",
                }}
              >
                머기중입니다.
              </Typography>
            ) : (
              <>
                {(isSubmitted || isAnswerTime) && (
                  <Typography
                    sx={{
                      fontSize:"20px",
                      fontWeight:"bold",
                      display:"flex",
                      justifyContent:"center",
                      alignItems:"center",
                      height:"100%",
                  }}>{result}</Typography>
                )}
                {time ? (
                  <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                      display:"flex",
                      justifyContent:"center",
                      alignItems:"center",
                      height:"100%",
                  }}>
                    {time}초 뒤 게임이 시작됩니다
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {!isSubmitted && !isAnswerTime && nowQuiz && (
                      <>
                        <Typography
                          sx={{
                            pt:"20px",
                            fontSize: "39px",
                            fontWeight: "bold",
                            pb:"35px",
                          }}
                        >
                          {now+1}번 {nowQuiz.isObjective ? "객관식" : "주관식"}
                        </Typography>
                        {/* Q 파트 */}
                        <Typography
                        sx={{
                          fontSize: "25px",
                          textShadow: `
                            1px 1px 0 #F08080,   /* 오른쪽 아래 */
                            -1px 1px 0 #F08080,  /* 왼쪽 아래 */
                            1px -1px 0 #F08080,  /* 오른쪽 위 */
                            -1px -1px 0 #F08080  /* 왼쪽 위 */
                          `,
                          fontWeight: "bold",
                        }}>
                          {nowQuiz.question}
                        </Typography>
                        {nowQuiz.isObjective ? (

                          // 객관식 파트
                          <Box
                            sx={{
                              marginTop: "25px",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              sx={{
                                width: "100%",
                                maxWidth: "600px",
                                mx: "auto",
                              }}
                            >
                              <ToggleButtonGroup
                                exclusive
                                value={message}
                                onChange={(_, value) => {
                                  setIsSubmitted(true);
                                  sendMessage(value)
                                }}
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  borderRadius: "15px",
                                  gap: 2,
                                }}
                              >
                                {nowQuiz.quizChoiceList.map((choiceList, index) => (
                                  <ToggleButton
                                    key={choiceList.choiceId}
                                    value={(index+1).toString()}
                                    sx={{
                                      minWidth: 300,
                                      maxWidth: "100%",
                                      backgroundColor: "whitesmoke",
                                    }}
                                  >
                                    {index+1}번. {choiceList.choiceText}
                                  </ToggleButton>
                                ))}
                              </ToggleButtonGroup>
                            </Box>
                          </Box>
                        ) : (

                          // 주관식 파트
                          <Box sx={{ display: "flex", pt:"20px" }}>
                            <TextField
                              variant="outlined"
                              fullWidth
                              value={message}
                              onChange={(event) => handleValueChange(event, setMessage)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  setIsSubmitted(true);
                                  sendMessage(message);
                                };
                              }}
                              sx={{
                                backgroundColor: "whitesmoke",
                                borderRadius: "5px",
                              }}
                            />
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{
                                ml: 1,
                              }}
                              onClick={() => {
                                setIsSubmitted(true);
                                sendMessage(message);
                              }}
                            >
                              <SendIcon />
                            </Button>
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                )}
              </>
            )}

          </Box>



          {/* 프로필 파트 */}
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              minHeight: "150px",
              height: "30%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems:"flex-end",
                width: "100%",
              }}
            >
              {participants?.map((participant) =>
                !participant.isExited && (
                <CustomTooltip
                  key={participant.nickName}
                  title={participant.latestMessage || ""}
                  open={tooltipOpen && highlightedNick === participant.nickName}
                  arrow
                  placement="top"
                >
                  <Card
                    sx={{
                      // width: "170px",
                      // height: "220px",
                      width: "15%",
                      minWidth: "10%",
                      maxWidth: "120px",
                      minHeight: "160px",
                      height: "23vh",
                      position: "relative",
                      border: "3px groove #BDDD",
                      borderRadius: "15px",
                      backgroundColor: "#ecf0f3",
                    }}>
                    <Box>
                      <img
                        src={`/main_profile/${participant.birdId}.png`}
                        alt={`${participant.nickName}'s bird`}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <hr />
                      <Box sx={{
                        display: "center",
                        justifyContent: "center",
                        height: "100%",
                        alignItems: "center",
                      }}>{participant.nickName}</Box>

                    </Box>
                  </Card>
                </CustomTooltip>
              ))}
            </Box>
          </Box>



        </Box>




        {/* 채팅 파트 */}
        <Box sx={{
          height:"20vh",
          backgroundColor:"blue",
        }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "20vh",
              p: 2,
              backgroundColor: "#f5f5f5",
          }}>


            {/* 채팅을 입력하는 부분 */}
            <Box sx={{ display: "flex"}}>
              <TextField
                variant="outlined"
                fullWidth
                value={message}
                onChange={(event) => handleValueChange(event, setMessage)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage(` ${message}`);
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => sendMessage(` ${message}`)}
                sx={{ ml: 1 }}
              >
                <SendIcon />
              </Button>
            </Box>

            {/* 채팅이 보이는 부분 */}
            <Paper
              sx={{
                flex: 1,
                p: 2,
                overflowY: "auto",
                mb: 2,
              }}
            >
              {/* <Typography variant="h6" gutterBottom>
                Chat
              </Typography> */}
              <List>
                {messages.map((msg) => (
                  <ListItem key={msg.chatLogId}>
                    <ListItemText primary={msg.timestamp} />
                    <ListItemText primary={msg.nickname} />
                    <ListItemText primary={msg.message} />
                    {!(msg.nickname===getCookie("nickname"))&&!isClicked[msg.chatLogId] && (
                    <AnnouncementIcon
                      onClick={() => reportChat(msg.chatLogId)}
                    />
                        )}
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Box>

      </Container>
    </Box>
  );
}
