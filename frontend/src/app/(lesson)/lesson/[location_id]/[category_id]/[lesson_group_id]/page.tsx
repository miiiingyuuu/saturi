"use client";

import { useEffect, useState, useRef } from "react";
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
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/axios";
import apiAi from "@/lib/axiosAI";
import toWav from "audiobuffer-to-wav"; // AudioBuffer를 WAV로 변환하는 라이브러리 import
import Chatbot from "@/components/chatbot/chatbot";

// 컴포넌트: LessonPage
export default function LessonPage() {
  interface Lesson {
    isDeleted: boolean; // 삭제 여부를 나타내는 속성
    lastUpdateDt: string; // 마지막 업데이트 날짜 (ISO 형식의 문자열)
    lessonId: number; // 레슨 ID
    sampleVoiceName: string; // 샘플 음성 이름
    sampleVoicePath: string; // 샘플 음성 경로 (URL)
    script: string; // 스크립트 내용
  }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLessonId, setCurrentLessonId] = useState<number>(1);
  const [isRecording, setIsRecording] = useState(false);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [lessonGroupId, setLessonGroupId] = useState<number | null>(null);
  const [lessonGroupResultId, setLessonGroupResultId] = useState<number | null>(
    null
  );
  const [lessons, setLessons] = useState<Lesson[]>([]); // lessons의 타입을 객체 배열로 명시
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [reportContent, setReportContent] = useState(""); // Report content state

  // 음성 녹음을 위한 변수
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null); // Store the final audio blob
  const [audioData, setAudioData] = useState<ArrayBuffer | null>(null);
  const [isFinalLesson,setIsFinalLesson]=useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();

  // 지역, 카테고리, 레슨그룹 정보
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split("/");
      const selectedLocation = parseInt(
        pathSegments[pathSegments.length - 3],
        10
      );
      const selectedCategory = parseInt(
        pathSegments[pathSegments.length - 2],
        10
      );
      const selectedLessonGroupId = parseInt(
        pathSegments[pathSegments.length - 1],
        10
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
        .then((response) => {
          if (response.status === 201) {
            // 레슨 그룹 아이디 설정
            setLessonGroupResultId(response.data.lessonGroupResultId);
            console.log(response.data.lessonGroupResultId);
          }
        })
        .catch((error) => {
          console.log("레슨 그룹 결과 테이블 생성 실패오류 :", error);
        });
    }
  }, [lessonGroupId, pathname]);

  // 정답음성 재생을 위한 함수
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
        setAudioData(arrayBuffer); // 오디오 데이터를 메모리에 저장
        handlePlayAudio(arrayBuffer); // 오디오 재생
      } else {
        console.error("Failed to download audio");
      }
    } catch (error) {
      console.error("Error downloading audio:", error);
    }
  };

  // 재생 함수
  const handlePlayAudio = async (audioData: ArrayBuffer) => {
    if (audioData) {
      const audioContext = new window.AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(audioData);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    }
  };

  // lessons 할당 함수
  useEffect(() => {
    if (locationId !== null && categoryId !== null && lessonGroupId !== null) {
      api
        .get(
          `learn/lesson-group?locationId=${locationId}&categoryId=${categoryId}`
        )
        .then((response) => {
          if (response.status === 200) {
            console.log("category의 lessonGroups: ", response);

            // Find the lesson group that matches the lessonGroupId
            const matchedGroup = response.data.find(
              (group: { lessonGroupId: number }) =>
                group.lessonGroupId === lessonGroupId
            );

            if (matchedGroup) {
              const fetchedLessons = matchedGroup.lessons;
              setLessons(fetchedLessons);

              // Set the currentLessonId to the first lesson's lessonId
              if (fetchedLessons.length > 0) {
                setCurrentLessonId(fetchedLessons[0].lessonId);
              }
            }
          }
        })
        .catch((error) => {
          console.error("API 요청 중 오류 발생:", error);
        });
    }
  }, [locationId, categoryId, pathname, lessonGroupId]);

  // 녹음 파일을 GCR 에 저장,
  const handleNext = async () => {
    if (isRecording) {
      alert("녹음을 완료해주세요");
      return;
    }
    if (audioBlobRef.current) {
      try {
        const wavBlob = await convertToWav(audioBlobRef.current);
        const arrayBuffer = await wavBlob.arrayBuffer();
        const base64AudioData = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        // google-storage 에 저장
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
        console.log("File uploaded with name:", result.filename);

        // 현재 레슨 정보 가져오기
        const currentLesson = lessons[currentIndex];
        if (!currentLesson) {
          console.error("Current lesson not found.");
          return;
        }

        if (currentIndex >= lessons.length - 1) {
          setIsFinalLesson(true); // 컴포넌트를 변경
        }
        // 정답파일명, 음성파일명을 django 로 보내서 분석결과 수집
        const analysisResponse = await apiAi.post("/audio/analyze/", {
          answerVoiceFileName: `${currentLesson.sampleVoiceName}.wav`, // 현재 레슨의 샘플 파일 이름 사용
          userVoiceFileName: `${result.filename}`,
          answerScript: `${currentLesson.script}`,
        });
        console.log(analysisResponse);
        if (analysisResponse.status !== 200) {
          throw new Error("Failed to analyze audio");
        }

        // 분석 결과
        console.log(analysisResponse.data);

        // 개별 레슨 결과 전송
        const requestBody = {
          lessonId: currentLessonId,
          lessonGroupResultId: lessonGroupResultId, // "레슨 그룹 결과 테이블 생성"에서 받아온 lessonGroupResultId 사용
          accentSimilarity: analysisResponse.data.voiceSimilarity,
          pronunciationAccuracy: analysisResponse.data.scriptSimilarity,
          filePath: "this_is_not_file_path", // 임시 data 가능
          fileName: result.filename, // (추가) 유저 음성 파일 이름
          graphInfoX: analysisResponse.data.userVoiceTime,
          graphInfoY: analysisResponse.data.userVoicePitch,
          script: analysisResponse.data.userScript,
        };


        const lessonResponse = await api.post("/learn/lesson", requestBody);

        if (lessonResponse.status !== 201) {
          throw new Error("Failed to save lesson result");
        }

        console.log("Lesson result saved:", lessonResponse.data);

        // 모든 레슨을 완료한 경우, 결과 보기로 이동
        if (currentIndex >= lessons.length - 1) {
          // 이 부분을 수정
          await handleResult(); // 마지막 문제일 때도 handleResult 실행
        } else {
          const newIndex = currentIndex + 1;
          setCurrentIndex(newIndex);
          setCurrentLessonId(lessons[newIndex].lessonId); // currentLessonId 업데이트
          audioBlobRef.current = null; // Move to next lesson only if audio is uploaded primaryfully
        }
      } catch (error) {
        const err = error as any; // error를 any 타입으로 캐스팅
        setIsFinalLesson(false);
        alert("재녹음이 필요해요"); // 녹음 업로드 실패 시 경고창 표시
        console.error("Error in handleNext:", err);

      }
    } else {
      alert("녹음이 되지 않았어요"); // 녹음이 없을 때 경고창 표시
    }
  };

  // 녹음 후 구글 스토리지로 저장
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

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          audioBlobRef.current = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          audioChunksRef.current = [];
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }
  };

  const handleResult = async () => {
    if (lessonGroupResultId !== null) {
      router.push(
        `${pathname}/result?lessonGroupResultId=${lessonGroupResultId}`
      );
    } else {
      console.error("lessonGroupResultId가 설정되지 않았습니다.");
    }
  };

  const handleSkip = () => {
    if (isRecording) {
      alert("녹음을 완료해주세요");
      return;
    }
    // 건너뛰기
    api
      .put(`learn/lesson/${currentLessonId}`)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
        console.log(currentLessonId);
      });

    // 다음 문장으로
    if (currentIndex < lessons.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentLessonId(lessons[newIndex].lessonId); // currentLessonId 업데이트
    } else {
      handleResult();
    }
  };

  const handleClaim = () => {
    // 신고 내용을 포함하여 서버에 요청 전송
    const requestBody = {
      lessonId: currentLessonId,
      content: reportContent,
    };
    console.log(requestBody);
    api
      .post(`learn/lesson/claim`, requestBody)
      .then((response) => {
        console.log(response);
        setModalOpen(false); // 모달 닫기
        setReportContent(""); // 입력 필드 초기화
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setReportContent(""); // 입력 필드 초기화
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "700px",
        height: "90vh",
        display: "flex",
        alignItems: "center",
        // minWidth: "1100px"
      }}
    >
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          minHeight: "560px",
          maxHeight: "700px",
          minWidth:"1100px",
          border: "3px solid lightgray",
          borderRadius: "15px",
          padding: "15px",
          position: "relative", // Allow absolute positioning inside the card
        }}
      >
        {false ? (
        <Box
        className="w-full h-full"
        sx={{
          display: "flex",         // Use Flexbox for centering
          flexDirection: "column", // Stack children vertically
          justifyContent: "center",// Center content vertically
          alignItems: "center",    // Center content horizontally
          minWidth: "560px",
        }}
      >
        <Image
          src="/images/loadingBird.gif"
          alt="귀여운 쿼카"
          width={320}
          height={338}
          style={{
            objectFit: "contain", // Ensure the image maintains its aspect ratio
            maxWidth: "100%",     // Allow image to resize responsively
            height: "auto",       // Maintain aspect ratio
          }}
          className="max-w-full h-auto ml-4"
        />
        <Typography
          variant="h4"
          sx={{
            textAlign: "center", // Ensure text is centered
            mt: 2,               // Add some margin to separate from image
          }}
        >
          레슨 결과를 전송 중이에요
        </Typography>
      </Box>
      ):
        <Grid container spacing={3} className="row">
          {/* 왼쪽 부분 */}
          <Grid item xs={12} md={12}>
            <Box className="grid grid-cols-1 justify-center items-center w-full h-full">
              <Box className="items-center flex flex-col">
                <Image
                  src="/images/singingBird.gif"
                  alt="귀여운 쿼카"
                  width={150}
                  height={150}
                  className="object-contain max-w-full h-auto"
                />
              </Box>
            </Box>
          </Grid>
  
          {/* 오른쪽 부분 */}
          <Grid item xs={12} md={12} >
            <Box
              className="flex justify-center items-center w-full h-full bg-gray-200"
              sx={{
                borderRadius: "15px",
                position: "relative", // For absolute positioning of the buttons
                // minWidth: "1100px"
              }}
            >
              <Box
                className="rounded flex flex-col items-center justify-center"
                sx={{
                  width: "80%",
                }}
              >
                <Typography className="text-3xl font-bold text-black m-2">
                  {`Lesson ${currentIndex + 1} of ${lessons.length}`}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={((currentIndex + 1) / lessons.length) * 100}
                  className="w-4/5 m-5   h-4 rounded-xl justify-center"
                  sx={{
                    border: "5px solid litegray",
                    borderRadius: 5, // 테두리를 둥글게 설정
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 5, // 진행 바 자체도 둥글게 설정
                    },
                  }}
                />
  
                {lessons.map((lesson, index) => (
                  <Box
                    key={lesson.lessonId}
                    sx={{
                      display: index === currentIndex ? "flex" : "none",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDownloadAndPlayAudio(lesson)} // Click handler to play audio
                  >
                    <Typography
                      variant="h1"
                      className="mb-2 text-4xl font-bold text-black text-nowrap"
                    >
                      {lesson.script}
                    </Typography>
                    <Image
                      src="/images/speaker.png" // Path to your speaker icon
                      alt="Speaker Icon"
                      width={50} // Set appropriate width
                      height={50} // Set appropriate height
                      className="ml-2 mb-2"
                    />
                  </Box>
                ))}
  
                {/* 마이크 버튼을 크게 중앙에 배치 */}
                <IconButton
                  className={`text-nowrap rounded-full m-2 ${isRecording ? "glowing-border" : ""}`}
                  onClick={handleRecording}
                  sx={{
                    width: "80px",
                    height: "80px",
                    minWidth: "80px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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
  
              {/* 건너뛰기와 다음 문장 버튼을 오른쪽 아래에 배치 */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                }}
              >
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
                  >
                    다음 문장
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    결과 보기
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
        }
  
        {/* 문제 신고 버튼 - Positioning at the bottom right of the card */}
        {!isFinalLesson?(        
        <Button
        variant="contained"
        color="error"
        sx={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          width: "40px",
          height: "40px",
          minWidth: "40px",
          borderRadius: "50%",
          padding: 0,
          margin: 0,
        }}
        onClick={handleOpenModal}
        >
          !
        </Button>)
        :"" }
  
        {/* 문제 신고 모달 */}
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
              onChange={(e) => setReportContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              취소
            </Button>
            <Button onClick={handleClaim} color="primary">
              제출
            </Button>
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

  // audiobuffer-to-wav 라이브러리를 사용하여 AudioBuffer를 WAV로 변환
  const wavArrayBuffer = toWav(audioBuffer);

  // WAV ArrayBuffer를 Blob으로 변환
  return new Blob([wavArrayBuffer], { type: "audio/wav" });
}

