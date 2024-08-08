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
} from "@mui/material";
import { getCookie } from "cookies-next";
import useConfirmLeave from "@/hooks/useConfirmLeave";
import { useRouter } from "next/navigation"
import { styled } from "@mui/material/styles"
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

export default function App({ params: { roomId } }: RoomIdProps) {
  const router = useRouter()
  const clientRef = useConnect();
  const [now, setNow] = useState(1);
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

  function updateParticipantMessage(nickName: string, message: string) {
    setParticipants((prevParticipants) =>
      prevParticipants.map((participant) =>
        participant.nickName === nickName
          ? { ...participant, latestMessage: message }
          : participant
      )
    );
  }

  function sendMessage(message: string) {
    if (message.trim() && clientRef.current) {
      clientRef.current.publish({
        destination: "/pub/chat",
        body: JSON.stringify({
          quizId: now,
          message,
          roomId,
        }),
        headers: {
          Authorization: sessionStorage.getItem("accessToken") as string,
        },
      });
      const you = getCookie("nickname");
      setHighlightedNick(you as string);
      updateParticipantMessage(you as string, message);
      showTooltip();
      setTimeout(() => setHighlightedNick(null), 3000);
    }
    setMessage("");
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
          console.log(body)
          if (Array.isArray(body)) {
            setQuizzes(body);
          } else if (!isStart && body.chatType === "START") {
            setIsStart(true);
            setParticipants(body.participants);
          }
        });

        client.subscribe(`/sub/chat/${roomId}`, (message: IMessage) => {
          const body = JSON.parse(message.body);
          console.log(body)
          if (body.correct) {
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
          };
          setMessages((prevMsg) => [newMsg, ...prevMsg]);
        });
      };

      const onDisconnect = () => {
        client.publish({
          destination: "/pub/room",
          body: JSON.stringify({
            roomId,
            chatType: "TERMINATED"
          }),
          headers: {
            Authorization: sessionStorage.getItem("accessToken") as string,
          },
        });
      };

      const handleBeforeUnload = () => {
        onDisconnect();
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("unload", handleBeforeUnload);

      client.onDisconnect = onDisconnect;
      client.onConnect = onConnect;

      if (client.connected) {
        onConnect();
      }

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("unload", handleBeforeUnload);
      };
    }
  }, [roomId, clientRef]);

  useEffect(() => {
    if (Array.isArray(quizzes)) {
      const data = quizzes.find((quiz) => quiz.quizId === now);
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
      {!isStart ? (
        <Typography
          component="h1"
          variant="h5"
          sx={{
            textAlign: "center",
            mb: 3,
          }}
        >
          대기중입니다.
        </Typography>
      ) : (
        <>
          {isAnswerTime && (
            <Typography>{result}</Typography>
          )}
          {time ? (
            <Typography
              component="h1"
              variant="h5"
              sx={{
                textAlign: "center",
                mb: 3,
              }}
            >
              {time}초 뒤 게임이 시작됩니다
            </Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                marginBottom: "150px",
              }}
            >
              {!isAnswerTime && nowQuiz && (
                <>
                  <Typography
                    sx={{
                      fontSize: "39px",
                      fontWeight: "bold",
                    }}
                  >
                    {nowQuiz.quizId-1}번 {nowQuiz.isObjective ? "객관식" : "주관식"}
                  </Typography>
                  <Typography>{nowQuiz.question}</Typography>
                  {nowQuiz.isObjective ? (
                    <Box
                      sx={{
                        marginTop: "50px",
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
                            gap: 2,
                          }}
                        >
                          {nowQuiz.quizChoiceList.map((choiceList) => (
                            <ToggleButton
                              key={choiceList.choiceId}
                              value={choiceList.choiceId.toString()}
                              sx={{
                                minWidth: 300,
                                maxWidth: "100%",
                              }}
                            >
                              {choiceList.choiceId}번. {choiceList.choiceText}
                            </ToggleButton>
                          ))}
                        </ToggleButtonGroup>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex" }}>
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

      <Box
        sx={{
          display: "grid",
          placeItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "1100px",
          }}
        >
          {participants?.map((participant) => (
            <CustomTooltip
              key={participant.birdId}
              title={participant.latestMessage || ""}
              open={tooltipOpen && highlightedNick === participant.nickName}
              arrow
              placement="top"
            >
              <Card sx={{ width: "200px", height: "300px", position: "relative" }}>
                {participant.nickName}
                <Box>
                  <img
                    src={`/main_profile/${participant.birdId}.png`}
                    alt={`${participant.nickName}'s bird`}
                    style={{ width: "100%", height: "auto" }}
                  />
                </Box>
              </Card>
            </CustomTooltip>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          p: 2,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Paper
          sx={{
            flex: 1,
            p: 2,
            overflowY: "auto",
            mb: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Chat
          </Typography>
          <List>
            {messages.map((msg, index) => (
              <ListItem key={index}>
                <ListItemText primary={msg.timestamp} />
                <ListItemText primary={msg.nickname} />
                <ListItemText primary={msg.message} />
              </ListItem>
            ))}
          </List>
        </Paper>
        <Box sx={{ display: "flex" }}>
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
      </Box>
    </Box>
  );
}
