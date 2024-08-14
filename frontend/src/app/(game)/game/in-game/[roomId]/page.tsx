"use client"

import { pink } from '@mui/material/colors';
import { IMessage } from "@stomp/stompjs";
import useConnect from "@/hooks/useConnect";
import LogoutIcon from "@mui/icons-material/Logout";
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

interface TipsProps {
 tipId: number
 content: string
}

interface UserProps {
  nickName: string
  birdId: number
  isExited: boolean
}


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
  const [ quizTimer, setQuizTimer] = useState(10);
  const [ isCorrect, setIsCorrect] = useState(false);
  const [ tips, setTips ] = useState<TipsProps[]>([])
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [ isEnd, setIsEnd ] = useState(false)
  const [ chat, setChat ] = useState("")
  const [highlightedWinner, setHighlightedWinner] = useState<string | null>(null);
  const textFieldRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)


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

  function sendMessage(message: string, setFunction: (value: string) => void) {
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
    setFunction("")
  }

  // 잔여 인원 수
  const remainCount = useMemo(() =>
    participants?.filter(participant => !participant?.isExited).length
  , [participants])
  // 잔여 인원 수를 세어 방에 2명 이상이 있었다가, 1명만 남은 경우 방을 폭파시킨다.

  useEffect(() => {
    const client = clientRef.current;
    if (!isEnd && client && participants?.length>1 && remainCount<=1) {
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
      router.push("/")
    }
  }, [remainCount,participants]);

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
      setIsEnd(true)
      setResult("문제를 모두 풀었습니다. \n 잠시 후 결과페이지로 이동합니다.")
      setTimeout(() => {
        router.replace(`/game/in-game/${roomId}/result`)
      },3000)
    }
  }, [quizzes, now]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const client = clientRef.current;
    if (client) {
      const onConnect = () => {
        // 방 정보 구독
        client.subscribe(`/sub/room/${roomId}`, (message: IMessage) => {
          const body = JSON.parse(message.body)
          // 바디가 배열의 형태로 주어지는 경우 (퀴즈 전송 시에만 해당)
          if (Array.isArray(body)) {
            setQuizzes(body);
          } else {
            setParticipants(body.participants);
            if (!isStart && body.chatType === "START") {
               setIsStart(true)
            }
            if (body.chatType === "ENTER" || body.chatType === "EXIT" || body.chatType === "START") {
              const yourStatus = body.participants?.find((p: UserProps) => p.nickName === getCookie("nickname"))
              if (!isEnd && yourStatus !== undefined && yourStatus.isExited) {
                alert("퇴장한 방에 다시 입장하실 수 없습니다.")
                router.replace("/")
              }
            }
          }
        });

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
          // 방에서 정답이 나오면
          if (body.correct) {
            // 정답자 하이라이팅
             setHighlightedWinner(body.senderNickName)
            // 채팅 관련 정보를 초기화 하고
            setIsSubmitted(false)
            setMessage("")
            // 정답자 축하 타임 (이때 꺼짐)
            setIsAnswerTime(true);
            setIsCorrect(true)
            // 니가 정답자라면
            if (you === body.senderNickName) {
              setResult("정답입니다!");
            } else {
              setResult(`${body.senderNickName}님이 정답을 맞추셨습니다`);
            }
            // 5초 후, 다음 문제로 넘어가기
            setTimeout(() => {
              setHighlightedWinner(null);
              setIsAnswerTime(false);
              setResult("틀렸습니다!")
              setNow((prev) => prev + 1);
              // 여기서 문제 타이머 설정하기
              setQuizTimer(10)
              setIsCorrect(false)
              setMessage("");
            }, 5000);
          }
          // 시간
          const timestamp = new Date().toLocaleTimeString("ko-KR", {
            hour12: false,
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
          setMessages((prevMsg) => [ ...prevMsg, newMsg,]);

          // 말풍선 관련 호출 함수
          setHighlightedNick(body.senderNickName);
          updateParticipantMessage(body.senderNickName, body.message);
          showTooltip();
          setTimeout(() => setHighlightedNick(null), 3000);
        });
      };

      // 게임 종료 시
      const onDisconnect = () => {
        clientRef.current?.publish({
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

      // client.onDisconnect = onDisconnect;
      client.onConnect = onConnect;

      if (client.connected) {
        onConnect();
        window.removeEventListener("unload", onDisconnect);
      }
      return () => {
        if (client) {
        onDisconnect()
        }
      }
    }
  }, [roomId, clientRef]);

  // 타이머 작동
  useEffect(() => {
    if (time && isStart) {
      setTimeout(() => setTime(time - 1), 1000);
    }
  }, [time, isStart]);

  // 문제 타이머
  useEffect(() => {
    // 게임 로딩 타이머가 다 됐고
    // 퀴즈 타이머가 남아있고,
    // 퀴즈가 현재 진행중이고 (isStart)
    // 정답 타임이 아닌 경우
    if (!time && quizTimer && isStart && !isAnswerTime) {
      setTimeout(() => setQuizTimer(quizTimer - 1), 1000)
    }
    // 정답자가 아예 없는 경우
    if (!isAnswerTime && quizTimer === 0) {
      setResult("정답자가 없습니다.")
      setIsAnswerTime(true)
      setTimeout(() => {
        if (!isCorrect) {
        setNow((prev) => prev+1)
        setIsSubmitted(false)
        setIsAnswerTime(false)
        setQuizTimer(10)
        setMessage("")
        setResult("틀렸습니다.")
        }
      },3000)
    }
  }, [time,quizTimer,isStart,isAnswerTime]);

  // 빡종 방지
  useConfirmLeave();

  
  useEffect(() => {
    api.get("/game/tip")
      .then(response => {
        setTips(response.data);
      })
  }, []);

  useEffect(() => {
    if (!isStart) {
    setTimeout(() => setCurrentTipIndex(prev => (prev+1)%tips?.length||1), 5000)
    }
  }, [isStart,currentTipIndex]);

  useEffect(() => {
    if (textFieldRef.current) {
      (textFieldRef.current).focus()
    }
  }, [nowQuiz]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({behavior: "smooth"})
    }
  }, [messages]);

  return (
    <Box sx={{ display: 'flex', height: '90vh', flexDirection: 'row', m: 3}}>
      {/* 게임 파트 */}
      <Box
        sx={{
          flex: 2, // 게임 파트가 화면의 약 2/3을 차지합니다.
          height: '100%',
          backgroundImage: "url(/MainPage/background.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "15px",
          border: "3px groove black",
          display: 'flex',
          flexDirection: 'column',
          position: 'relative', // 프로필 파트를 절대 위치로 배치하기 위한 설정
        }}
      >
        <Container maxWidth="lg" sx={{ height: '100%' }}>
          {/* 문제와 관련된 부분 */}
          <Box
            sx={{
              height: 'calc(100% - 8vh - 27vh)', // quizTimer와 프로필 파트를 제외한 나머지 공간
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              fontSize: '18px'
            }}
          >
            {/* 중요파트 */}
            {!isAnswerTime && isStart  && !time && `남은 시간: ${quizTimer}`}
            {!isStart ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography
                  component="h1"
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "whitesmoke",
                    padding: "30px",
                    borderRadius: "15px",
                    opacity: "0.7",
                  }}
                >
                  팁: {tips[currentTipIndex]?.content}
                </Typography>
              </Box>
            ) : (
              <>
                {(isSubmitted || isAnswerTime) && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
                      {result}
                    </Typography>
                  </Box>
                )}
                {time ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
                      {time}초 뒤 게임이 시작됩니다
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "grid", placeItems: "center", flex: 1 }}>
                    {!isSubmitted && !isAnswerTime && nowQuiz && (
                      <>
                        <Typography sx={{ pt: "20px", fontSize: "39px", fontWeight: "bold", pb: "30px" }}>
                          {now + 1}번 {nowQuiz.isObjective ? "객관식" : "주관식"}
                        </Typography>
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
                          }}
                        >
                          {nowQuiz.question}
                        </Typography>
                        {nowQuiz.isObjective ? (
                          // 객관식 파트
                          <Box sx={{ marginTop: "25px", display: "flex", justifyContent: "space-between" }}>
                            <Box sx={{ width: "100%", maxWidth: "600px", mx: "auto" }}>
                              <ToggleButtonGroup
                                exclusive
                                value={message}
                                onChange={(_, value) => {
                                  setIsSubmitted(true);
                                  sendMessage(value, setMessage);
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
                                    value={(index + 1).toString()}
                                    sx={{
                                      minWidth: 300,
                                      maxWidth: "100%",
                                      backgroundColor: "whitesmoke",
                                    }}
                                  >
                                    {index + 1}번. {choiceList.choiceText}
                                  </ToggleButton>
                                ))}
                              </ToggleButtonGroup>
                            </Box>
                          </Box>
                        ) : (
                          // 주관식 파트
                          <Box sx={{ display: "flex", pt: "20px" }}>
                            <TextField
                              inputRef={textFieldRef}
                              variant="outlined"
                              fullWidth
                              value={message}
                              onChange={(event) => handleValueChange(event, setMessage)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  setIsSubmitted(true);
                                  sendMessage(message, setMessage);
                                }
                              }}
                              sx={{ backgroundColor: "whitesmoke", borderRadius: "5px" }}
                            />
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{ ml: 1 }}
                              onClick={() => {
                                setIsSubmitted(true);
                                sendMessage(message, setMessage);
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
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '27vh', // 프로필 파트가 게임 파트 하단에서 27vh를 차지합니다.
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              overflow: 'auto',
              backgroundColor: 'rgba(255, 255, 255, 0.4)', // 배경에 약간의 투명도 추가
            }}
          >
            {participants?.map((participant) =>
                !(participant?.isExited) && (
                  <CustomTooltip
                    key={participant.nickName}
                    title={participant.latestMessage || ""}
                    open={tooltipOpen && highlightedNick === participant.nickName}
                    arrow
                    placement="top"
                  >
                    <Card
                      sx={{
                        width: "15%",
                        aspectRatio: "1 / 1.4",
                        minWidth: "10%",
                        maxWidth: "120px",
                        minHeight: "160px",
                        position: "relative",
                        border: "3px groove #BDDD",
                        borderRadius: "15px",
                        backgroundColor: highlightedWinner === participant.nickName ? "#d1ffd6" : "#ecf0f3", // 하이라이팅 색상
                        m: 3, // 카드 간의 마진
                        transition: "background-color 0.3s ease", // 부드러운 색상 전환

                      }}
                    >
                      <Box>
                        <img
                          src={`/main_profile/${participant.birdId}.png`}
                          alt={`${participant.nickName}'s bird`}
                          style={{ width: "100%", height: "auto" }}
                        />
                        <hr />
                        <Box sx={{ textAlign: "center", p: 1 }}>
                          {participant.nickName}
                        </Box>
                      </Box>
                    </Card>
                  </CustomTooltip>
                )
            )}
          </Box>
        </Container>
      </Box>

      {/* 채팅 파트 */}
      <Box
        sx={{
          flex: 1, // 채팅 파트가 화면의 약 1/3을 차지합니다.
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 채팅이 보이는 부분 */}
        <Box
          sx={{
            flex: 1,
            px: 2,
            pt: 2,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Paper
            sx={{
              flex: 1,
              p: 2,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <List>
              {messages.map((msg) => (
                <ListItem
                  key={msg.chatLogId}
                  sx={{
                    p: 0.5
                  }}
                >
                  <Box className="w-2/12">
                    <ListItemText primary={msg.timestamp} />
                  </Box>
                  <Box className="w-4/12">
                    <ListItemText primary={msg.nickname} />
                  </Box>
                  <Box className="w-5/12">
                    <ListItemText primary={msg.message} />
                  </Box>
                  {!(msg.nickname === getCookie("nickname")) && !isClicked[msg.chatLogId] && (
                    <AnnouncementIcon
                      className="w-1/12"
                      onClick={() => reportChat(msg.chatLogId)}
                    />
                  )}
                </ListItem>
              ))}
              {/* 스크롤을 맨 아래로 이동시키는 div */}
              <div ref={chatEndRef} />
            </List>
          </Paper>
        </Box>

        {/* 채팅을 입력하는 부분 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            // height: '9vh',
            px: 1,
            pt: 1,
          }}
        >
          <TextField
            variant="outlined"
            fullWidth
            value={chat}
            onChange={(event) => handleValueChange(event, setChat)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage(` ${chat}`, setChat);
            }}
          />
          <Button
            variant="contained"
            onClick={() => {
              if(confirm("반복적인 중도 퇴장 시 제재를 받으실 수 있습니다. \n나가시겠습니까?")) {
                router.replace("/")
              }
            }}
            sx={{
              ml: 1,
              bgcolor: pink[500],
              '&:hover' : {
                bgcolor: pink[600],
              },
              '&:active' : {
                bgcolor: pink[700],
              }
            }}
          >
            <LogoutIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
