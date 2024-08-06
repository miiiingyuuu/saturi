"use client";

import React, { useEffect, useState } from "react";
import { MessagesProps, RoomIdProps } from "@/utils/props";
import SendIcon from '@mui/icons-material/Send';
import { handleValueChange } from "@/utils/utils";
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
} from "@mui/material";
import useConnect from "@/hooks/useConnect";
import { IMessage } from "@stomp/stompjs";


export default function App({params:{roomId}}: RoomIdProps) {
  const clientRef = useConnect()
  const [ messages, setMessages] = useState<MessagesProps[]>([]);
  const [ message, setMessage] = useState('');
  const [ quizzes, setQuizzes ] = useState([])
  // const [  ] = useState(1)

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
          console.log(body)
        })

        // 채팅방 접속
        client.subscribe(`/sub/chat/${roomId}`, (message: IMessage) => {
          const body = JSON.parse(message.body)
          const timestamp = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
          const newMsg: MessagesProps = {timestamp, nickname: body.senderNickName, message:body.message}
          setMessages(prevMsg =>[newMsg,...prevMsg])
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

  // /////////////
  // Toggle 파트
  // /////////////
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <Box>
      <Box
        sx = {{
          display: "grid",
          placeItems: "center",
          marginBottom: "150px",
        }}>
        <Typography
          sx={{
            fontSize: "39px",
            fontWeight: "bold",
          }}
        >
          주관식 퀴즈
        </Typography>
        <Typography>
          정구지의 표준말은?
        </Typography>
        <Box 
          sx={{
            marginTop:"50px",
            display:"flex",
            justifyContent:"space-between",
            width:"600px",
            height:"70px",
            visibility: 0 === 1 ? "hidden" : "visible",                       
        }}>
          <ToggleButton value="check" selected={isToggled} sx={{width: "120px", border: isToggled ? '2px solid #1976d2' : '2px solid transparent'}} onClick={handleToggle}>
            여기에 입력
          </ToggleButton>
          <ToggleButton value="check" selected={isToggled} sx={{width: "120px", border: isToggled ? '2px solid #1976d2' : '2px solid transparent'}} onClick={handleToggle}>
            여기에 입력
          </ToggleButton>
          <ToggleButton value="check" selected={isToggled} sx={{width: "120px", border: isToggled ? '2px solid #1976d2' : '2px solid transparent'}} onClick={handleToggle}>
            여기에 입력
          </ToggleButton>
          <ToggleButton value="check" selected={isToggled} sx={{width: "120px", border: isToggled ? '2px solid #1976d2' : '2px solid transparent'}} onClick={handleToggle}>
            여기에 입력
          </ToggleButton>
        </Box>
      </Box>

      <Box
        sx = {{
          display: "grid",
          placeItems: "center",
        }}>
        <Box
          sx = {{
            display: "flex",
            justifyContent: "space-between",
            width: "1100px",
          }}
        >
          <Card sx={{width: "200px", height: "300px"}}> 플레이어 </Card>
          <Card sx={{width: "200px", height: "300px"}}> 플레이어 </Card>
          <Card sx={{width: "200px", height: "300px"}}> 플레이어 </Card>
          <Card sx={{width: "200px", height: "300px"}}> 플레이어 </Card>
          <Card sx={{width: "200px", height: "300px"}}> 플레이어 </Card>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          p: 2,
          backgroundColor: '#f5f5f5',
        }}
      >
        <Paper
          sx={{
            flex: 1,
            p: 2,
            overflowY: 'auto',
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
        <Box sx={{ display: 'flex' }}>
          <TextField
            variant="outlined"
            fullWidth
            value={message}
            onChange={event => handleValueChange(event, setMessage)}
            onKeyDown={e => {
              if (e.key === "Enter") sendMessage()
            }}
            placeholder="Type your message..."
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={sendMessage}
            sx={{ ml: 1 }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};