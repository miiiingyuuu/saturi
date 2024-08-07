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
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/axios";
import apiAi from "@/lib/axiosAI";
import toWav from "audiobuffer-to-wav"; // AudioBuffer를 WAV로 변환하는 라이브러리 import

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
    null,
  );
  const [lessons, setLessons] = useState<Lesson[]>([]); // lessons의 타입을 객체 배열로 명시
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [reportContent, setReportContent] = useState(""); // Report content state

  // 음성 녹음을 위한 변수
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null); // Store the final audio blob
  const [audioData, setAudioData] = useState<ArrayBuffer|null>(null);

  const router = useRouter();
  const pathname = usePathname();

  // 지역, 카테고리, 레슨그룹 정보
  useEffect(() => {
    if(pathname){
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
            // 레슨 그룹 아이디 설정
            setLessonGroupResultId(response.data.lessonGroupResultId);
          }
        })
        .catch(error => {
          console.log("레슨 그룹 결과 테이블 생성 실패오류 :", error);
        });
    }
  }, [lessonGroupId, pathname]);

  // 정답음성 재생을 위한 함수
  // 오디오 다운로드 및 재생 함수 
  const handleDownloadAndPlayAudio = async (lesson: object) => {
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ filename: lesson.sampleVoiceName }),
        body: JSON.stringify({ filename: "경상도_드라마_11_1994_병문안안가봐도되나.wav" }),
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
          `learn/lesson-group?locationId=${locationId}&categoryId=${categoryId}`,
        )
        .then(response => {
          if (response.status === 200) {
            console.log(response);
            if (
              response.data.length > 0 &&
              response.data[lessonGroupId - 1].lessons
            ) {
              const fetchedLessons = response.data[lessonGroupId - 1].lessons;
              setLessons(fetchedLessons);
              // 첫 번째 레슨의 lessonId로 currentLessonId 설정
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
  }, [locationId, categoryId, pathname, lessonGroupId]);



  // 녹음 파일을 GCR 에 저장,
  const handleNext = async () => {
    // 녹음 파일 google-storage 저장
    if (audioBlobRef.current) {
      const wavBlob = await convertToWav(audioBlobRef.current);
      const arrayBuffer = await wavBlob.arrayBuffer();
      const base64AudioData = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          "",
        ),
      );
      // google-storage 에 저장
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audioData: base64AudioData }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("File uploaded with name:", result.filename);

        // 정답파일명, 음성파일명을 django 로 보내서 분석결과 수집
        apiAi
          .post("/audio/analyze/", {
            answerVoiceFileName: "경상도_드라마_11_1994_병문안안가봐도되나.wav",
            userVoiceFileName: `${result.filename}`,
          })
          .then(res => {
            if (res.status === 200) {
              // 분석 결과
              console.log(res.data);
              // 개별 레슨 결과 전송
              console.log(
                "lessonId: ",
                currentLessonId,
                "lessonGroupResultId: ",
                lessonGroupResultId,
              );
              const requestBody = {
                lessonId: currentLessonId,
                lessonGroupResultId: lessonGroupResultId, // "레슨 그룹 결과 테이블 생성"에서 받아온 lessonGroupResultId 사용
                accentSimilarity: res.data.voiceSimilarity,
                pronunciationAccuracy: res.data.scriptSimilarity,
                filePath: "this_is_not_file_path", // 임시 data 가능
                fileName: result.filename, // (추가) 유저 음성 파일 이름
                // 데이터 크기가 너무 커서 지금은 주석처리
                // graphInfoX: res.data.userVoiceTime, // (추가) 유저 음성 파형 정보 x좌표 임시 data 가능
                // garphInfoY: res.data.userVoicePitch, // (추가) 유저 음성 파형 정보 y좌표
                graphInfoX: "time for voice",
                graphInfoY: "pitch for voice",
                script: res.data.userScript,
              };
              console.log("curretlessonid:", typeof currentLessonId);
              // Log the request body
              console.log("Request Body:", requestBody);
              api
                .post("/learn/lesson", requestBody)
                .then(res => {
                  if (res.status === 201) {
                    console.log(res);
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            }
          })
          .catch(error => {
            if (error.response) {
              // 요청은 성공적으로 보내졌지만, 서버가 2xx 범위 외의 상태 코드를 응답한 경우
              console.error("Response error:", error.response.data);
              console.error("Status:", error.response.status);
              console.error("Headers:", error.response.headers);
            } else if (error.request) {
              // 요청이 보내졌지만, 응답을 받지 못한 경우
              console.error("Request error:", error.request);
            } else {
              // 요청을 설정하는 과정에서 에러가 발생한 경우
              console.error("Error", error.message);
            }
            console.log("레슨 결과 분석 실패 :", error.config);
          });
        //
      } else {
        console.error("Failed to upload file");
      }
    }

    if (currentIndex < lessons.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);  
      setCurrentLessonId(lessons[newIndex].lessonId); // currentLessonId 업데이트
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

        mediaRecorder.ondataavailable = event => {
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

  const handleResult = () => {
    router.push(`${pathname}/result`);
  };

  const handleSkip = () => {
    // 건너뛰기
    api
      .put(`learn/lesson/${currentLessonId}`)
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
    // 다음 문장으로
    if (currentIndex < lessons.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentLessonId(lessons[newIndex].lessonId); // currentLessonId 업데이트
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
      .then(response => {
        console.log(response);
        setModalOpen(false); // 모달 닫기
        setReportContent(""); // 입력 필드 초기화
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
    setReportContent(""); // 입력 필드 초기화
  };

  return (
    <div className="grid grid-cols-2 h-screen justify-center items-center">
      <div className="grid grid-cols-1 justify-center items-center w-full h-full">
        <div className="items-center p-4 flex flex-col">
          <Image
            src="/images/quokka.jpg"
            alt="귀여운 쿼카"
            width={800}
            height={800}
            className="object-contain max-w-full h-auto"
          />

          <Button
            variant="contained"
            color="success"
            className="mt-4 text-nowrap"
            onClick={handleOpenModal}
          >
            문제 신고
          </Button>
        </div>
      </div>
      <div className="flex justify-center items-center w-full h-full">
        <div className="bg-gray-200 p-8 md:p-16 lg:p-24 rounded shadow flex flex-col items-center justify-center w-full max-w-3xl">
          <h1 className="text-3xl font-bold text-black mb-2">
            {currentIndex + 1}/5
          </h1>
          {lessons.map((lesson, index) => (
            <h1
              key={lesson.lessonId}
              className="mb-2 text-4xl font-bold text-black"
              style={{
                display: index === currentIndex ? "block" : "none",
                cursor: "pointer"
              }}
              onClick={() => handleDownloadAndPlayAudio(lesson)} // lesson.script 클릭 시 오디오 다운로드 및 재생
            >
              {lesson.script}
            </h1>
          ))}
          <div className="mt-4 flex space-x-2">
            <Button
              className="text-nowrap"
              variant="contained"
              color={isRecording ? "error" : "success"}
              onClick={handleRecording}
            >
              {isRecording ? "녹음 중지" : "녹음 시작"}
            </Button>
            <Button
              variant="contained"
              color="success"
              className="text-nowrap"
              onClick={handleSkip}
            >
              건너뛰기
            </Button>
            {currentIndex < lessons.length - 1 ? (
              <Button
                variant="contained"
                color="success"
                className="text-nowrap"
                onClick={handleNext}
              >
                다음 문장
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleResult}
              >
                결과 보기
              </Button>
            )}
          </div>
        </div>
      </div>

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
            onChange={e => setReportContent(e.target.value)}
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
    </div>
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
