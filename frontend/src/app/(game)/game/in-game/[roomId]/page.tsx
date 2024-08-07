"use client";

import { IMessage } from "@stomp/stompjs";
import useConnect from "@/hooks/useConnect";
import SendIcon from "@mui/icons-material/Send";
import { handleValueChange } from "@/utils/utils";
import React, { useEffect, useState } from "react";
import { GameQuizChoiceProps, GameQuizProps, MessagesProps, RoomIdProps } from "@/utils/props";
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

export default function App({ params: { roomId } }: RoomIdProps) {
  const clientRef = useConnect();
  const [now, setNow] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessagesProps[]>([]);
  const [quizzes, setQuizzes] = useState<GameQuizProps<GameQuizChoiceProps>[]>([]);
  const [nowQuiz, setNowQuiz] = useState<GameQuizProps<GameQuizChoiceProps>>();
  const [isAnswerTime, setIsAnswerTime] = useState(false);
  const [result, setResult] = useState("");
  const [time, setTime] = useState(10);
  // const [participants, setParticipants] = useState<Object[]>([])
  // TODO: 들어올때, 들어오고 나서 사람들 들어올때 실행해서 participants 채우기

  function sendMessage() {
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
          const body = JSON.parse(message.body);
          if (Array.isArray(body)) {
            setQuizzes(body);
          }
        });

        client.subscribe(`/sub/chat/${roomId}`, (message: IMessage) => {
          const body = JSON.parse(message.body);
          if (body.correct) {
            // 정답자에 대한 예우를 지켜줘야함
            if (you === body.senderNickName) {
              setResult("너 재능있어");
            } else {
              setResult("허접");
            }
            setIsAnswerTime(true);

            setTimeout(() => {
              setIsAnswerTime(false);
              setNow((prev) => prev + 1);
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

      client.onConnect = onConnect;
      if (client.connected) {
        onConnect();
      }
    }
  }, [roomId, clientRef]);

  useEffect(() => {
    if (Array.isArray(quizzes)) {
      const data = quizzes.find((quiz) => quiz.quizId === now);
      setNowQuiz(data);
    }
  }, [quizzes, now]);

  useEffect(() => {
    if (time) {
      setTimeout(() => setTime(time - 1), 1000);
    } else {
      setNow((prev) => prev + 1);
    }
  }, [time]);

  useConfirmLeave();
  return (
    <Box>
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
                {nowQuiz.quizId}번 {nowQuiz.isObjective ? "객관식" : "주관식"}
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
                      onChange={(_, value) => setMessage(value)}
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
                  <TextField variant="outlined" fullWidth />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      ml: 1,
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
          {/* TODO: 닉네임이랑 프사 받아오기 */}
          {/* {participants?.map((participant) => ( */}
          {/*   <Card sx={{ width: "200px", height: "300px" }}> {participant.nickname} </Card> */}
          {/*   ) */}
          {/* )} */}
          {/* <Card sx={{ width: "200px", height: "300px" }}> 플레이어 </Card> */}
          {/* <Card sx={{ width: "200px", height: "300px" }}> 플레이어 </Card> */}
          {/* <Card sx={{ width: "200px", height: "300px" }}> 플레이어 </Card> */}
          {/* <Card sx={{ width: "200px", height: "300px" }}> 플레이어 </Card> */}
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
              if (e.key === "Enter") sendMessage();
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            sx={{ ml: 1 }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
