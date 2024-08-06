"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/axios";
import apiAi from "@/lib/axiosAI";
import toWav from "audiobuffer-to-wav"; // AudioBuffer를 WAV로 변환하는 라이브러리 import



// 컴포넌트: LessonPage
export default function LessonPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentlessonId, setCurrentlessonId] = useState<number>(1);
  const [isRecording, setIsRecording] = useState(false);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [lessonGroupId, setLessonGroupId] = useState<number | null>(null);
  const [lessonGroupResultId, setLessonGroupResultId] = useState<number | null>(null);
  const [lessons, setLessons] = useState<object[]>([]); // lessons의 타입을 객체 배열로 명시
  // 음성 녹음을 위한 변수
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null); // Store the final audio blob

  const router = useRouter();
  const pathname = usePathname();
  
  // // lesson/2/1/1 에서 데이터 있음, 테스트용 더미데이터
  // const tempLessons = [
  //   {
  //     lessonId: 1,
  //     sampleVoicePath: null,
  //     script: "test script 1",
  //     lastUpdateDt: "2024-08-31T12:00:47.786786",
  //     isDeleted: false,
  //   },
  //   {
  //     lessonId: 2,
  //     sampleVoicePath: null,
  //     script: "test script 2",
  //     lastUpdateDt: "2024-08-31T12:00:47.786786",
  //     isDeleted: false,
  //   },
  //   {
  //     lessonId: 3,
  //     sampleVoicePath: null,
  //     script: "test script 3",
  //     lastUpdateDt: "2024-08-31T12:00:47.786786",
  //     isDeleted: false,
  //   },
  //   {
  //     lessonId: 4,
  //     sampleVoicePath: null,
  //     script: "test script 4",
  //     lastUpdateDt: "2024-08-31T12:00:47.786786",
  //     isDeleted: false,
  //   },
  //   {
  //     lessonId: 5,
  //     sampleVoicePath: null,
  //     script: "test script 5",
  //     lastUpdateDt: "2024-08-31T12:00:47.786786",
  //     isDeleted: false,
  //   },
  // ];
  // 지역, 카테고리, 레슨그룹 정보
  useEffect(() => {
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
    
  }, [pathname, router]);

  // 레슨 그룹 결과 생성 함수
  useEffect(() => {
    if (lessonGroupId !== null) {
    api
      .post(`learn/lesson-group-result/${lessonGroupId}`)
      .then(response => {
        if (response.status === 201) {
          // 레슨 그룹 아이디 설정
          setLessonGroupResultId(response.data.lessonGroupResultId)
        }
      })
      .catch(error => {
        console.log("레슨 그룹 결과 테이블 생성 실패오류 :", error);
      });
  }}, [lessonGroupId,pathname]);
  
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
              setLessons(response.data[lessonGroupId - 1].lessons);              
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
        apiAi.post('/audio/analyze/',
          {
            "answerVoiceFileName": '1994_가시나운동하나도안했네.wav',
            "userVoiceFileName": `${result.filename}`,
          }
        ).then((res) => {
          if (res.status === 200) {
            // 분석 결과
            console.log(res.data);
            // 개별 레슨 결과 전송
            console.log("lessonId: ",currentlessonId,"lessonGroupResultId: ",lessonGroupResultId)
            const requestBody = {
              lessonId: currentlessonId,
              lessonGroupResultId: lessonGroupResultId, // "레슨 그룹 결과 테이블 생성"에서 받아온 lessonGroupResultId 사용
              accentSimilarity: res.data.voiceSimilarity,
              pronunciationAccuracy: res.data.scriptSimilarity,
              filePath: 'this_is_not_file_path', // 임시 data 가능
              fileName: result.filename, // (추가) 유저 음성 파일 이름
              // 데이터 크기가 너무 커서 지금은 주석처리
              // graphInfoX: res.data.userVoiceTime, // (추가) 유저 음성 파형 정보 x좌표 임시 data 가능
              // garphInfoY: res.data.userVoicePitch, // (추가) 유저 음성 파형 정보 y좌표
              graphInfoX: 'time for voice',
              graphInfoY: 'pitch for voice',
              script: res.data.userScript,
            };
            console.log("curretlessonid:",typeof(currentlessonId))
            // Log the request body
            console.log('Request Body:', requestBody);
            api.post('/learn/lesson',requestBody
            )
            .then(res=>{
              if(res.status === 201){
                console.log(res)
              }})
            .catch((error)=>{
              console.log(error)
            })
          }
        })
        .catch((error) => {
          if (error.response) {
            // 요청은 성공적으로 보내졌지만, 서버가 2xx 범위 외의 상태 코드를 응답한 경우
            console.error('Response error:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
          } else if (error.request) {
            // 요청이 보내졌지만, 응답을 받지 못한 경우
            console.error('Request error:', error.request);
          } else {
            // 요청을 설정하는 과정에서 에러가 발생한 경우
            console.error('Error', error.message);
          }
          console.log('레슨 결과 분석 실패 :', error.config);
        });        
        // 
        
      } else {
        console.error("Failed to upload file");
      }
    }


    if (currentIndex < lessons.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentlessonId(lessons[currentIndex].lessonId)
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
          <Button variant="outlined" className="mt-4" onClick={handleRecording}>
            {isRecording ? "녹음 중지" : "녹음 시작"}
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
              }}
            >
              {lesson.script}
            </h1>
          ))}
          <div className="mt-4 flex space-x-2">
            <Button
              variant="contained"
              color={isRecording ? "error" : "success"}
              onClick={handleRecording}
            >
              {isRecording ? "녹음 중지" : "녹음 시작"}
            </Button>
            <Button variant="contained" color="success" onClick={handleNext}>
              건너뛰기
            </Button>
            {currentIndex < lessons.length - 1 ? (
              <Button variant="contained" color="success" onClick={handleNext}>
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
    </div>
  );
}

// WebM Blob을 WAV로 변환하는 헬퍼 함수
async function convertToWav(webmBlob) {
  const arrayBuffer = await webmBlob.arrayBuffer();
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // audiobuffer-to-wav 라이브러리를 사용하여 AudioBuffer를 WAV로 변환
  const wavArrayBuffer = toWav(audioBuffer);

  // WAV ArrayBuffer를 Blob으로 변환
  return new Blob([wavArrayBuffer], { type: "audio/wav" });
}
