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


export default function App({params:{roomId}}: RoomIdProps) {
  const clientRef = useConnect();
  const [ now, setNow ] = useState(1);
  const [ message, setMessage] = useState("");
  const [ messages, setMessages] = useState<MessagesProps[]>([]);
  const [ quizzes, setQuizzes ] = useState<GameQuizProps<GameQuizChoiceProps>[]>([]);
  const [ nowQuiz, setNowQuiz ] = useState<GameQuizProps<GameQuizChoiceProps>>();


  useEffect(() => {
    const client = clientRef.current;
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
        });
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
        });

        // 퀴즈 받았어요
        client.subscribe(`/sub/room/${roomId}`, (message: IMessage) => {
          console.log(message)
          const body = JSON.parse(message.body);
          if (Array.isArray(body)) {
            setQuizzes(body);
          }
        });

        // 채팅방 접속
        client.subscribe(`/sub/chat/${roomId}`, (message: IMessage) => {
          const body = JSON.parse(message.body);
          console.log(body)
          if (body.correct) {
            console.log("너? 재능있어")
            console.log("너 게임 계속 해")
            setNow(prev => prev+1)
          }

          const timestamp = new Date().toLocaleTimeString("ko-KR", {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
          });
          const newMsg: MessagesProps = {
            timestamp,
            message:body.message,
            nickname: body.senderNickName,
          };
          setMessages(prevMsg =>[newMsg,...prevMsg]);
        });
      };

      client.onConnect = onConnect;
      if (client.connected) {
        onConnect();
      }
    }
  }, [roomId, clientRef]);

  function sendMessage() {
    if (message.trim() && clientRef.current) {
      clientRef.current.publish({
        destination: "/pub/chat",
        body: JSON.stringify({
          quizId: now,
          message,
          roomId
        }),
        headers: {
          Authorization: sessionStorage.getItem("accessToken") as string,
        },
      });
    }
    setMessage("");
  }

  useEffect(() => {
    if (Array.isArray(quizzes)) {
      const data = quizzes.find((quiz) => quiz.quizId === now);
      setNowQuiz(data);
    }
  }, [quizzes, now]);

  return (
    <Box>
      <Button
        onClick={
          () => setNow(prev=>prev+1)
        }
      >
        문제 넘기기
      </Button>
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          marginBottom: "150px",
        }}
      >
        <Typography
          sx={{
            fontSize: "39px",
            fontWeight: "bold",
          }}
        >
          {nowQuiz?.isObjective ? "객관식" : "주관식"}
        </Typography>
        <Typography>
          {nowQuiz?.question}
        </Typography>
        {nowQuiz?.isObjective? (
          <Box
            sx={{
              marginTop: "50px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {nowQuiz && (
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
            )}
          </Box>
        ): (
          <div>
          <TextField
            variant="outlined"
            fullWidth
          />
          </div>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          placeItems: "center",
        }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "1100px",
          }}
        >
          <Card sx={{ width: "200px", height: "300px" }}> 플레이어 </Card>
          <Card sx={{ width: "200px", height: "300px" }}> 플레이어 </Card>
          <Card sx={{ width: "200px", height: "300px" }}> 플레이어 </Card>
          <Card sx={{ width: "200px", height: "300px" }}> 플레이어 </Card>
          <Card sx={{ width: "200px", height: "300px" }}> 플레이어 </Card>
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
            onChange={event => handleValueChange(event, setMessage)}
            onKeyDown={e => {
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
};
