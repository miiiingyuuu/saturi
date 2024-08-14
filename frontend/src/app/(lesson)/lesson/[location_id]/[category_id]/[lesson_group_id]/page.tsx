"use client";

import { useEffect, useState, useRef, SyntheticEvent } from "react";
import Image from "next/image";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
  Grid,
  Box,
  Card,
  Typography,
  LinearProgress,
  IconButton,
  Slider,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/axios";
import apiAi from "@/lib/axiosAI";
import toWav from "audiobuffer-to-wav";
import Chatbot from "@/components/chatbot/chatbot";
import CustomButton from "@/components/ButtonColor";

export default function LessonPage() {
  interface Lesson {
    isDeleted: boolean;
    lastUpdateDt: string;
    lessonId: number;
    sampleVoiceName: string;
    sampleVoicePath: string;
    script: string;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLessonId, setCurrentLessonId] = useState<number>(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [lessonGroupId, setLessonGroupId] = useState<number | null>(null);
  const [lessonGroupResultId, setLessonGroupResultId] = useState<number | null>(
    null,
  );
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // 추가된 부분

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null);
  const [audioData, setAudioData] = useState<ArrayBuffer | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  // 지역, 카테고리, 레슨그룹 정보 설정
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split("/");
      const selectedLocation = parseInt(
        pathSegments[pathSegments.length - 3],
        10,
      );
      const selectedCategory = parseInt(
        pathSegments[pathSegments.length - 2],
        10,
      );
      const selectedLessonGroupId = parseInt(
        pathSegments[pathSegments.length - 1],
        10,
      );
      if (
        ![1, 2, 3].includes(selectedLocation) ||
        Number.isNaN(selectedCategory)
      ) {
        router.push("/lesson/2/1");
      } else {
        setLocationId(selectedLocation);
        setCategoryId(selectedCategory);
        setLessonGroupId(selectedLessonGroupId);
      }
    }
  }, [pathname, router]);

  // 레슨 그룹 결과 생성 함수
  useEffect(() => {
    if (lessonGroupId !== null) {
      api
        .post(`learn/lesson-group-result/${lessonGroupId}`)
        .then(response => {
          if (response.status === 201) {
            setLessonGroupResultId(response.data.lessonGroupResultId);
          }
        })
        .catch(error => {
          console.log("레슨 그룹 결과 테이블 생성 실패오류 :", error);
        });
    }
  }, [lessonGroupId]);

  // lessons 할당 함수
  useEffect(() => {
    if (locationId !== null && categoryId !== null && lessonGroupId !== null) {
      api
        .get(
          `learn/lesson-group?locationId=${locationId}&categoryId=${categoryId}`,
        )
        .then(response => {
          if (response.status === 200) {
            const matchedGroup = response.data.find(
              (group: { lessonGroupId: number }) =>
                group.lessonGroupId === lessonGroupId,
            );

            if (matchedGroup) {
              const fetchedLessons = matchedGroup.lessons;
              setLessons(fetchedLessons);

              if (fetchedLessons.length > 0) {
                setCurrentLessonId(fetchedLessons[0].lessonId);
              }
            }
          }
        })
        .catch(error => {
          console.error("API 요청 중 오류 발생:", error);
        });
    }
  }, [locationId, categoryId, lessonGroupId]);

  // 녹음 완료 상태 감지하여 "다음 문장" 버튼 활성화
  useEffect(() => {
    if (audioBlobRef.current && !isRecording) {
      setIsNextEnabled(true); // 녹음이 완료되었고, 오디오 데이터가 있는 경우 버튼 활성화
    }
  }, [isRecording]);

  // 오디오 재생 함수
  const handlePlayAudio = (audioData: ArrayBuffer) => {
    if (isPlaying) return;  // 이미 재생 중인 경우, 새로운 재생 요청 무시

    if (audioData) {
      const audioBlob = new Blob([audioData], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = audioUrl;

        audioRef.current.onplay = () => setIsPlaying(true);  // 오디오가 재생 중임을 나타내는 상태 설정
        audioRef.current.play();

        audioRef.current.onloadedmetadata = () => {
          setDuration(audioRef.current!.duration);
        };

        audioRef.current.ontimeupdate = () => {
          if (!isSeeking) {
            setCurrentTime(audioRef.current!.currentTime);
          }
        };

        audioRef.current.onended = () => {
          setCurrentTime(audioRef.current!.currentTime);
          setIsPlaying(false);  // 오디오가 끝났을 때 상태 업데이트
        };
      } else {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onplay = () => setIsPlaying(true);  // 오디오가 재생 중임을 나타내는 상태 설정

        audio.onloadedmetadata = () => {
          setDuration(audio.duration);
        };

        audio.ontimeupdate = () => {
          if (!isSeeking) {
            setCurrentTime(audio.currentTime);
          }
        };

        audio.onended = () => {
          setCurrentTime(audio.currentTime);
          setIsPlaying(false);  // 오디오가 끝났을 때 상태 업데이트
        };

        audio.play();
      }
    }
  };

  // 오디오 다운로드 및 재생 함수
  const handleDownloadAndPlayAudio = async (lesson: Lesson) => {
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: `${lesson.sampleVoiceName}.wav`,
        }),
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        setAudioData(arrayBuffer);
        handlePlayAudio(arrayBuffer);
      } else {
        console.error("Failed to download audio");
      }
    } catch (error) {
      console.error("Error downloading audio:", error);
    }
  };

  // 슬라이더 핸들러
  const handleSliderChange = (event: Event | SyntheticEvent<Element, Event>, newValue: number | number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newValue as number;
      setCurrentTime(newValue as number);
    }
  };

  const handleSliderChangeCommitted = (event: Event | SyntheticEvent<Element, Event>, newValue: number | number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newValue as number;
      setCurrentTime(newValue as number);
      setIsSeeking(false);
      audio.play();
    }
  };

  const handleSliderChangeStart = () => {
    setIsSeeking(true);
  };

  // 녹음 후 Google Cloud Storage로 저장
  const handleNext = async () => {
    if (isRecording) {
      alert("녹음을 완료해주세요");
      return;
    }
    if (audioBlobRef.current) {
      try {
        setIsLoading(true);
        const wavBlob = await convertToWav(audioBlobRef.current);
        const arrayBuffer = await wavBlob.arrayBuffer();
        const base64AudioData = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
        );

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ audioData: base64AudioData }),
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file");
        }

        const result = await uploadResponse.json();

        const currentLesson = lessons[currentIndex];
        if (!currentLesson) {
          console.error("Current lesson not found.");
          return;
        }

        const analysisResponse = await apiAi.post("/audio/analyze/", {
          answerVoiceFileName: `${currentLesson.sampleVoiceName}.wav`,
          userVoiceFileName: `${result.filename}`,
          answerScript: `${currentLesson.script}`,
        });
        if (analysisResponse.status !== 200) {
          throw new Error("Failed to analyze audio");
        }

        const requestBody = {
          lessonId: currentLessonId,
          lessonGroupResultId: lessonGroupResultId,
          accentSimilarity: analysisResponse.data.voiceSimilarity,
          pronunciationAccuracy: analysisResponse.data.scriptSimilarity,
          filePath: "this_is_not_file_path",
          fileName: result.filename,
          graphInfoX: analysisResponse.data.userVoiceTime,
          graphInfoY: analysisResponse.data.userVoicePitch,
          script: analysisResponse.data.userScript,
        };

        const lessonResponse = await api.post("/learn/lesson", requestBody);

        if (lessonResponse.status !== 201) {
          throw new Error("Failed to save lesson result");
        }

        if (currentIndex >= lessons.length - 1) {
          await handleResult();
        } else {
          const newIndex = currentIndex + 1;
          setCurrentIndex(newIndex);
          setCurrentLessonId(lessons[newIndex].lessonId);
          audioBlobRef.current = null;
          setIsNextEnabled(false);
        }
      } catch (error) {
        alert("재녹음이 필요해요");
        console.error("Error in handleNext:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("녹음이 되지 않았어요");
    }
  };

  // 녹음 시작 및 종료 처리
  const handleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = event => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          audioBlobRef.current = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          audioChunksRef.current = [];
          setIsNextEnabled(true); // 녹음이 완료되면 "다음 문장" 버튼 활성화
        };

        mediaRecorder.start();
        setIsRecording(true);
        setIsNextEnabled(false); // 녹음 중에는 "다음 문장" 버튼 비활성화
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }
  };

  // 결과 보기 처리
  const handleResult = async () => {
    if (lessonGroupResultId !== null) {
      router.push(
        `${pathname}/result?lessonGroupResultId=${lessonGroupResultId}`,
      );
    } else {
      console.error("lessonGroupResultId가 설정되지 않았습니다.");
    }
  };

  // 나가기 처리
  const handleExit = () => {
    router.push(`/lesson/${locationId}/${categoryId}`);
  };

  // 건너뛰기 처리
  const handleSkip = () => {
    if (isRecording) {
      alert("녹음을 완료해주세요");
      return;
    }
    api
      .put(`learn/lesson/${currentLessonId}`)
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
        console.log(currentLessonId);
      });

    if (currentIndex < lessons.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentLessonId(lessons[newIndex].lessonId);
      setIsNextEnabled(false); // 건너뛰기 시 다음 문장 버튼 비활성화
    } else {
      handleResult();
    }
  };

  // 신고 처리
  const handleClaim = () => {
    const requestBody = {
      lessonId: currentLessonId,
      content: reportContent,
    };
    api
      .post(`learn/lesson/claim`, requestBody)
      .then(response => {
        console.log(response);
        setModalOpen(false);
        setReportContent("");
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setReportContent("");
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "650px",
        height: "90vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxHeight: "700px",
          minWidth: "1100px",
          border: "6px solid #4b2921",
          borderRadius: "30px",
          padding: "15px",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            mb: 2,
            position: "relative",
          }}
        >
          <Typography
            className="text-3xl font-bold text-center text-black"
            sx={{
              ml: 2,
            }}
          >
            {`${currentIndex + 1} / ${lessons.length}`}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={((currentIndex + 1) / lessons.length) * 100}
            className="flex-grow h-4 rounded-xl border-4 border-lightgray"
            sx={{
              width: "60%",
              mx: 2,
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
              },
            }}
          />

          {!isLoading && (
            <Button
              variant="contained"
              className="w-10 h-10 min-w-10 rounded-full p-0 m-0"
              onClick={handleOpenModal}
              color="warning"
              sx={{
                mr: 2,
              }}
            >
              신고
            </Button>
          )}
        </Box>

        {isLoading ? (
          <Box
            className="w-full h-full"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minWidth: "560px",
            }}
          >
            <Image
              src="/images/loadingBird.gif"
              alt="귀여운 쿼카"
              width={320}
              height={338}
              style={{
                objectFit: "contain",
                maxWidth: "100%",
                height: "auto",
              }}
              className="max-w-full h-auto ml-4"
            />
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                margin: 4,
              }}
            >
              Now Loading...
            </Typography>
          </Box>
        ) : (
          <Grid container sx={{ alignItems: "flex-start" }}>
            <Grid item xs={12} md={12} className="">
              <Box className="flex justify-center items-center p-14">
                <Image
                  src="/images/singingBird.gif"
                  alt="노래하는 새"
                  width={150}
                  height={150}
                  className="object-contain max-w-full h-auto"
                />
              </Box>
            </Grid>

            <Box
              className="flex justify-center items-center w-full h-full bg-gray-200"
              sx={{
                borderRadius: "15px",
                position: "relative",
              }}
            >
              <Box
                className="rounded flex flex-col items-center justify-center"
                sx={{
                  width: "80%",
                }}
              >
                {lessons.map((lesson, index) => (
                  <Box
                    key={lesson.lessonId}
                    sx={{
                      display: index === currentIndex ? "flex" : "none",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDownloadAndPlayAudio(lesson)}
                  >
                    <Typography
                      variant="h1"
                      className="my-4 text-4xl font-bold text-black whitespace-normal break-keep text-center text-pretty"
                    >
                      {lesson.script}
                    </Typography>
                  </Box>
                ))}

                <Slider
                  value={currentTime}
                  step={0.1}
                  max={duration}
                  onChange={handleSliderChange}
                  onChangeCommitted={handleSliderChangeCommitted}
                  onMouseDown={handleSliderChangeStart}
                  sx={{ width: "100%", my: 2, height: 6 }}
                  aria-labelledby="continuous-slider"
                />

                <IconButton
                  className={`text-nowrap rounded-full m-2 ${
                    isRecording ? "glowing-border" : ""
                  }`}
                  onClick={handleRecording}
                  sx={{
                    width: "80px",
                    height: "80px",
                    minWidth: "80px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 10,
                  }}
                >
                  <Image
                    src="/images/mike.png"
                    alt="마이크 아이콘"
                    width={50}
                    height={50}
                  />
                </IconButton>
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  padding: "0 10px",
                }}
              >
                <Image
                  src="/images/speaker.png"
                  alt="Speaker Icon"
                  width={50}
                  height={50}
                  className="mb-2 ml-4 cursor-pointer"
                  onClick={() =>
                    handleDownloadAndPlayAudio(lessons[currentIndex])
                  }
                />

                <div className="flex gap-2">
                  <Button
                    variant="contained"
                    color="primary"
                    className="text-nowrap"
                    onClick={handleExit}
                  >
                    퍼즐선택
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className="text-nowrap"
                    onClick={handleSkip}
                  >
                    건너뛰기
                  </Button>
                  {currentIndex < lessons.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      className="text-nowrap"
                      onClick={handleNext}
                      disabled={!isNextEnabled}
                    >
                      다음 문장
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      disabled={!isNextEnabled}
                    >
                      결과 보기
                    </Button>
                  )}
                </div>

              </Box>
            </Box>
          </Grid>
        )}

        <Dialog open={modalOpen} onClose={handleCloseModal}>
          <DialogTitle>문제 신고</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="신고 내용"
              type="text"
              fullWidth
              value={reportContent}
              onChange={e => setReportContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <CustomButton onClick={handleCloseModal} color="primary">
              취소
            </CustomButton>
            <CustomButton onClick={handleClaim} color="primary">
              제출
            </CustomButton>
          </DialogActions>
        </Dialog>
      </Card>
      <Box>
        <Chatbot />
      </Box>
    </Container>
  );
}

// WebM Blob을 WAV로 변환하는 헬퍼 함수
async function convertToWav(webmBlob: Blob) {
  const arrayBuffer = await webmBlob.arrayBuffer();
  const audioContext = new window.AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const wavArrayBuffer = toWav(audioBuffer);

  return new Blob([wavArrayBuffer], { type: "audio/wav" });
}
