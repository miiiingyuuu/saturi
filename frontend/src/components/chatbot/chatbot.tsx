'use client'

import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  Fab,
  Grow,
  useTheme
} from '@mui/material';
import FlutterDashIcon from '@mui/icons-material/FlutterDash';
import SendIcon from '@mui/icons-material/Send';
import ReactMarkdown from 'react-markdown';

const INITIAL_MESSAGE = {
    sender: '챗봇',
    content: '사투리를 입력하시면 표준어를 알려드립니다.'
  };

const Chatbot: React.FC = () => {
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<{sender: string, content: string}[]>([]);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const toggleChatbot = () => {
    setChatbotVisible(!chatbotVisible);
    if (!chatbotVisible) {
        // 챗봇이 열릴 때 초기 메시지를 다시 표시
        setMessages([INITIAL_MESSAGE]);
      }
    };

  const addMessage = (sender: string, message: string) => {
    const newMessage = {
      sender,
      content: message
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const fetchAIResponse = async (prompt: string) => {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const apiEndpoint = "https://api.openai.com/v1/chat/completions";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "ft:gpt-4o-mini-2024-07-18:personal:saturi2:9uCN3x11",
        messages: [
          {
            role: "system",
            content: `
             GPT는 경상도 사투리를 표준어로 번역하는 역할을 합니다. 다음 사항을 유념해 주세요:
        1. 사용자가 경상도 사투리를 입력하면 표준어로 번역된 의미를 제공합니다. 
        2. 번역이 정확하고 자연스러워야 합니다.
        3. 가능한 한 정확한 정보를 제공하기 위해 국립국어원의 방언 찾기 시스템을 참고합니다.
        4. 번역된 문장은 이해하기 쉬워야 하고, 가능한 한 표준어로 자연스럽게 표현되어야 합니다.
        5. 모호한 경우에는 명확한 해설을 추가합니다.
        6. 모호한 사투리나 다의어의 경우, 추가적인 설명을 요청할 수 있습니다.
        7. 친근하고 도움이 되는 어조로 대화합니다.
      `,
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      }),
    };
    try {
      const response = await fetch(apiEndpoint, requestOptions);
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("OpenAI API 호출 중 오류 발생:", error);
      return "OpenAI API 호출 중 오류 발생";
    }
  };

  const sendMessage = async () => {
    if (userMessage.trim().length === 0) return;
    addMessage("나", userMessage);
    setUserMessage('');
    const aiResponse = await fetchAIResponse(userMessage);
    addMessage("사투리무새", aiResponse);
  };

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target as Node)) {
        setChatbotVisible(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && chatbotVisible) {
          setChatbotVisible(false);
        }
      };


    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    };
  }, [chatbotVisible]);

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }} ref={chatbotRef}>
      <Fab 
        color="primary" 
        onClick={toggleChatbot} 
        aria-label="chat"
        sx={{ 
          position: 'absolute', 
          bottom: 0, 
          right: 0,
          display: chatbotVisible ? 'none' : 'flex' 
        }}
      >
        <FlutterDashIcon />
      </Fab>
      <Grow 
        in={chatbotVisible} 
        style={{ transformOrigin: 'bottom right' }}
        {...(chatbotVisible ? { timeout: 300 } : {})}
      >
        <Paper 
          elevation={3}
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 300,
            height: 400,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 2, backgroundColor: theme.palette.primary.main, color: 'white' }}>
            <Typography variant="h6">사투리무새</Typography>
          </Box>
          <Box
            ref={chatMessagesRef}
            sx={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column-reverse',
              p: 2,
            }}
          >
            <List>
                {messages.map((msg, index) => (
                <ListItem key={index} alignItems="flex-start">
                    <ListItemText
                    primary={msg.sender}
                    secondary={
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                    }
                    />
                </ListItem>
                ))}
            </List>
          </Box>
          <Box sx={{ p: 2, backgroundColor: theme.palette.grey[100] }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="메시지를 입력하세요..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={sendMessage}
                    endIcon={<SendIcon />}
                  >
                  </Button>
                ),
              }}
            />
          </Box>
        </Paper>
      </Grow>
    </Box>
  );
};

export default Chatbot;