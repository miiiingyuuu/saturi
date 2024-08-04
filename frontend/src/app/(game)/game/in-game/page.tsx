"use client";

import React, { useState } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, Paper, Typography, Card } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput('');
    }
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
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
            {messages.map((message, index) => (
              <ListItem key={index}>
                <ListItemText primary={message} />
              </ListItem>
            ))}
          </List>
        </Paper>
        <Box sx={{ display: 'flex' }}>
          <TextField
            variant="outlined"
            fullWidth
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSend}
            sx={{ ml: 1 }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};