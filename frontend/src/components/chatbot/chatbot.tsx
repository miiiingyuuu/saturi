// const fetchAIResponse = async (prompt: string) => {
//   const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
//   const apiEndpoint = "https://api.openai.com/v1/chat/completions";
//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${apiKey}`,
//     },
//     body: JSON.stringify({
//       model: "ft:gpt-4o-mini-2024-07-18:personal::9vENm4j6",
//       messages: [
//         {
//           role: "system",
//           content: `
//            GPT는 경상도 사투리를 표준어로 번역하는 역할을 합니다. 다음 사항을 유념해 주세요:
//       1. 사용자가 경상도 사투리를 입력하면 표준어로 번역된 의미를 제공합니다.
//       2. 번역이 정확하고 자연스러워야 합니다.
//       3. 가능한 한 정확한 정보를 제공하기 위해 국립국어원의 방언 찾기 시스템을 참고합니다.
//       4. 번역된 문장은 이해하기 쉬워야 하고, 가능한 한 표준어로 자연스럽게 표현되어야 합니다.
//       5. 모호한 경우에는 명확한 해설을 추가합니다.
//       6. 모호한 사투리나 다의어의 경우, 추가적인 설명을 요청할 수 있습니다.
//       7. 친근하고 도움이 되는 어조로 대화합니다.
//     `,
//         },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0.8,
//       max_tokens: 1024,
//       top_p: 1,
//       frequency_penalty: 0.5,
//       presence_penalty: 0.5,
//     }),
//   };
//   setIsLoading(true)
//   try {
//     const response = await fetch(apiEndpoint, requestOptions);
//     const data = await response.json();
//     return data.choices[0].message.content;
//   } catch (error) {
//     console.error("OpenAI API 호출 중 오류 발생:", error);
//     return "OpenAI API 호출 중 오류 발생";
//   }
// };
// const sendMessage = async () => {
//   if (userMessage.trim().length === 0) return;
//   addMessage("나", userMessage);
//   setUserMessage('');
//   const aiResponse = await fetchAIResponse(userMessage);
//   addMessage("사투리무새", aiResponse);
//   setIsLoading(false)
// };

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Fab,
  Grow,
  useTheme,
  useMediaQuery,
  CircularProgress, // <-- 추가
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReactMarkdown, { Components } from 'react-markdown';
import Image from 'next/image';
import chatbotImage from '/public/chatbot.png';
import api from "@/lib/axios"; // 이미지 경로를 적절히 수정해주세요

const INITIAL_MESSAGE = {
  sender: '사투리무새',
  content: '사투리를 단어로 입력하시면 표준어를 알려드립니다.'
};

const Chatbot: React.FC = () => {
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<{sender: string, content: string}[]>([INITIAL_MESSAGE]);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const chatbotRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleChatbot = () => {
    setChatbotVisible(!chatbotVisible);
    if (!chatbotVisible) {
      setMessages([INITIAL_MESSAGE]);
    }
  };

  const addMessage = (sender: string, message: string) => {
    const newMessage = { sender, content: message };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const sendMessage = () => {
    if (userMessage.trim().length === 0) return;

    setUserMessage('');
    setIsLoading(true); // 로딩 시작
    addMessage('나', userMessage);

    api.post(
      '/chatbot',
      { content: userMessage },
      {
        headers: {
          'X-NCP-CLOVASTUDIO-API-KEY': process.env.NEXT_PUBLIC_CLOVA_API_KEY,
          'X-NCP-APIGW-API-KEY': process.env.NEXT_PUBLIC_CLOVA_GW_API_KEY,
          'X-NCP-CLOVASTUDIO-REQUEST-ID': process.env.NEXT_PUBLIC_REQUEST_ID,
          'Content-Type': 'application/json'
        }
      }
    )
      .then(response => response.data)
      .then((ans) => {
        setIsLoading(false); // 로딩 끝
        const answer = ans.endsWith('.') ? ans : ans + '...';
        addMessage('사투리무새', answer);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
        addMessage('사투리무새', 'API 호출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      });
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
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [chatbotVisible]);

  const customRenderers: Components = {
    p: ({ children, ...props }) => (
      <span className="markdown-paragraph" {...props}>
      {children}
    </span>
    ),
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }} ref={chatbotRef}>
      <Fab
        onClick={toggleChatbot}
        aria-label="chat"
        sx={{
          mb: 2,
          mr: 2,
          position: 'absolute',
          bottom: 0,
          right: 0,
          display: chatbotVisible ? 'none' : 'flex',
          width: 70,
          height: 70,
          backgroundColor: '#d2e1ff'
        }}
      >
        <Image src={chatbotImage} alt="Chatbot" width={40} height={40} />
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
            width: isMobile ? '100vw' : 350,
            height: isMobile ? '100vh' : 500,
            maxWidth: '100vw',
            maxHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: '10px'
          }}
        >
          <Box sx={{ p: 2, backgroundColor: '#d2e1ff', color: 'black' }}>
            <Typography variant="h6">사투리무새</Typography>
          </Box>
          <Box
            ref={chatMessagesRef}
            sx={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              p: 2,
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === '나' ? 'flex-end' : 'flex-start',
                  mb: 2,
                  alignItems: 'flex-start',
                }}
              >
                {msg.sender !== '나' && (
                  <Box sx={{ mr: 1, mt: 0.5 }}>
                    <Image
                      src={chatbotImage}
                      alt="Chatbot"
                      width={40}
                      height={40}
                      style={{ borderRadius: '50%' }}
                    />
                  </Box>
                )}
                <Box
                  sx={{
                    maxWidth: '70%',
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: msg.sender === '나' ? '#F0F5FF' : '#fff',
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                    {msg.sender}
                  </Typography>
                  <ReactMarkdown components={customRenderers}>{msg.content}</ReactMarkdown>
                </Box>
              </Box>
            ))}
            {isLoading && ( // 로딩 중 표시
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 2 }}>
                <Box sx={{ mr: 1, mt: 0.5 }}>
                  <Image
                    src={chatbotImage}
                    alt="Chatbot"
                    width={40}
                    height={40}
                    style={{ borderRadius: '50%' }}
                  />
                </Box>
                <Box
                  sx={{
                    maxWidth: '70%',
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    boxShadow: 1,
                    display: 'flex',
                    flexDirection: 'column', // <-- 세로로 정렬되도록 수정
                    alignItems: 'flex-start', // 왼쪽 정렬
                  }}
                >
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                    사투리무새
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} /> {/* 진행 중 표시 */}
                    <Typography variant="body2">
                      답변 생성 중...
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          <Box sx={{ p: 2, backgroundColor: theme.palette.grey[100] }}>
            <TextField
              autoFocus
              fullWidth
              variant="outlined"
              disabled={isLoading}
              placeholder="메시지를 입력하세요..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              InputProps={{
                endAdornment: (
                  <Button onClick={sendMessage} endIcon={<SendIcon sx={{ color: '#A0AFFF' }} />} />
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
