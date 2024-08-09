"use client"

import { IMessage } from "@stomp/stompjs";
import useConnect from "@/hooks/useConnect";
import SendIcon from "@mui/icons-material/Send";
import { handleValueChange } from "@/utils/utils";
import React, { useEffect, useState } from "react";
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

export default function App({ params: { roomId } }: RoomIdProps) {
  const router = useRouter()
  const clientRef = useConnect();
  const [now, setNow] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessagesProps[]>([]);
  const [quizzes, setQuizzes] = useState<GameQuizProps<GameQuizChoiceProps>[]>([]);
  const [nowQuiz, setNowQuiz] = useState<GameQuizProps<GameQuizChoiceProps>>();
  const [isAnswerTime, setIsAnswerTime] = useState(false);
  const [result, setResult] = useState("");
  const [time, setTime] = useState(10);
  const [isStart, setIsStart] = useState(false);
  const [participants, setParticipants] = useState<ParticipantsProps[]>([]);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [highlightedNick, setHighlightedNick] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState<IsClickedState>({});

  const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      fontSize: '20px', // 원하는 폰트 사이즈로 변경
    },
  });


  function showTooltip() {
    setTooltipOpen(true);
    setTimeout(() => setTooltipOpen(false), 3000); // 3초 후 Tooltip 닫기
  }

  function sendMessage(message: string) {
    if (message.trim() && clientRef.current) {
      clientRef.current.publish({
        destination: "/pub/chat",
        body: JSON.stringify({
          quizId: isStart&&nowQuiz?.quizId || 1 ,
          message,
          roomId,
        }),
        headers: {
          Authorization: sessionStorage.getItem("accessToken") as string,
        },
      });
      const you = getCookie("nickname");
      setHighlightedNick(you as string);
      showTooltip();
      setTimeout(() => setHighlightedNick(null), 3000);
    }
    setMessage("");
  }

  function reportChat(chatLogId: number) {
    api.post(`/game/user/${chatLogId}`)
        .then(() => {
          setIsClicked(prev => ({...prev, [chatLogId]: true}))
          alert("신고 완료되었습니다.")
        })
  }

  useEffect(() => {
    const you = getCookie("nickname");
    const client = clientRef.current;
    if (client) {
      const onConnect = () => {
        client.publish({
          destination: "/pub/room",
          body: JSON.stringify({
            chatType: "QUIZ",
            roomId,
          }),
          headers: {
            Authorization: sessionStorage.getItem("accessToken") as string,
          },
        });

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

        client.subscribe(`/sub/room/${roomId}`, (message: IMessage) => {
          const body = JSON.parse(message.body)
          if (Array.isArray(body)) {
            setQuizzes(body);
          }
          if (!isStart && body.chatType === "START") {
            setIsStart(true);
            setParticipants(body.participants);
          } else if (body.chatType === "ENTER") {
            setParticipants(body.participants);
          } else if (body.subType === "EXIT") {
            setParticipants(prev => prev.filter(participant => participant.nickName !== body.exitNickName));
            if (body.remainCount === 0) {
              client.publish({
                destination: "pub/room",
                body: JSON.stringify({
                  roomId,
                  chatType:"TERMINATED"
                }),
                headers: {
                  Authorization : sessionStorage.getItem("accessToken") as string
                }
              })
            }
          }
        });

        client.subscribe(`/sub/chat/${roomId}`, (message: IMessage) => {
          const body = JSON.parse(message.body);
          console.log(body)
          if (body.correct) {
            setMessage("")
            if (you === body.senderNickName) {
              setResult("정답입니다!");
            } else {
              setResult(`${body.senderNickName}님이 정답을 맞추셨습니다ㅋ`);
            }
            setIsAnswerTime(true);

            setTimeout(() => {
              setIsAnswerTime(false);
              setNow((prev) => prev + 1);
              if (body.quizId>10) {
                setResult("문제를 모두 풀었습니다. \n 잠시 후 결과페이지로 이동합니다.")
                setIsAnswerTime(true);
                client.publish({
                  destination: "/pub/room",
                  body: JSON.stringify({
                    chatType: "END",
                    roomId
                  }),
                  headers: {
                    Authorization: sessionStorage.getItem("accessToken") as string,
                  },
                })
                setTimeout(() => {
                  router.push(`/game/in-game/${roomId}/result`)
                }, 3000)
              }
            }, 5000);
          }

          const timestamp = new Date().toLocaleTimeString("ko-KR", {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
          });

          const newMsg: MessagesProps = {
            timestamp,
            message: body.message,
            nickname: body.senderNickName,
            chatLogId: body.chatLogId
          };
          setMessages((prevMsg) => [...prevMsg, newMsg]);
        });
      };

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

      const handleBeforeUnload = () => {
        onDisconnect();
      };

      window.addEventListener("unload", handleBeforeUnload);

      client.onDisconnect = onDisconnect;
      client.onConnect = onConnect;

      if (client.connected) {
        onConnect();
      }

      return () => {
        window.removeEventListener("unload", handleBeforeUnload);
      };
    }
  }, [roomId, clientRef]);

  useEffect(() => {
    if (Array.isArray(quizzes)) {
      const data = quizzes[now];
      setNowQuiz(data);
    }
  }, [quizzes, now]);

  useEffect(() => {
    if (time && isStart) {
      setTimeout(() => setTime(time - 1), 1000);
    } else if (time === 0 && isStart) {
      setNow((prev) => prev + 1);
    }
  }, [time, isStart]);

  useConfirmLeave();

  return (
    <Box>

      <Container maxWidth="lg">
        {/* 게임 파트 */}
        <Box sx={{
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
                {isAnswerTime && (
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
                    {!isAnswerTime && nowQuiz && (
                      <>
                        <Typography
                          sx={{
                            pt:"20px",
                            fontSize: "39px",
                            fontWeight: "bold",
                            pb:"35px",
                          }}
                        >
                          {nowQuiz.quizId-1}번 {nowQuiz.isObjective ? "객관식" : "주관식"}
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
                                if (e.key === "Enter") sendMessage(message);
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
                              onClick={() => sendMessage(message)}
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
              {participants?.map((participant) => (
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
                      minWidth:"10%",
                      maxWidth: "120px",
                      minHeight: "160px",
                      height: "23vh",
                      position: "relative", 
                      border:"3px groove #BDDD", 
                      borderRadius: "15px",
                      backgroundColor :"#ecf0f3",
                    }}>                    
                    <Box>
                      <img
                        src={`/main_profile/${participant.birdId}.png`}
                        alt={`${participant.nickName}'s bird`}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <hr/>
                      <Box sx={{
                        display:"center",
                        justifyContent:"center",
                        height:"100%",
                        alignItems:"center",                        
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
                  if (e.key === "Enter") sendMessage(message);
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => sendMessage(message)}
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
