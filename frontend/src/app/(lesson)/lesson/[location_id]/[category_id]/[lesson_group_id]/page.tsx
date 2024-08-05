"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Box, Typography } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/axios";

// lessongroup_id 를 받을 것
// 받아온 lessongroup_id 에 따라서 스크립트를 조회
//

export default function LessonPage() {
  
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [lessonId, setLessonId] = useState<number | null>(null);
  const [lessons, setLessons] = useState<object>([]);
  const router = useRouter();
  const pathname = usePathname();
  
  // locationId, categoryId, lessonId 할당
  useEffect(()=>{
    const pathSegments = pathname.split("/")
    const selectedLocation = parseInt(
      pathSegments[pathSegments.length - 3],
      10,
    );    
    const selectedCategory= parseInt(pathSegments[pathSegments.length-2],10);
    const selectedLesson = parseInt(pathSegments[pathSegments.length-1],10)
    
    if (![1, 2, 3].includes(selectedLocation) || Number.isNaN(selectedCategory)) {
      router.push("/lesson/1/1");
    } else {
      setLocationId(selectedLocation);
      setCategoryId(selectedCategory);
      setLessonId(selectedLesson)
    }
  }, [pathname, router]);
  
  
  useEffect(() => {
    if (locationId !== null && categoryId !== null && lessonId !== null) {
      api.get(`learn/lesson-group?locationId=${locationId}&categoryId=${categoryId}`)
      .then(response => {
        if (response.status === 200) {
          console.log(response);
          if (response.data.length > 0 && response.data[lessonId-1].lessons){
            setLessons(response.data[lessonId-1].lessons)
          }
        }
      }).catch(error => {
        console.error("API 요청 중 오류 발생:", error);
      });
    }
  }, [locationId, categoryId]);
  
  
  // 받아오는 데이터가 없어서 데이터 형식이랑 똑같이 만든 더미데이터
  const temp_lessons = [
    {lessonId:1, sampleVoicePath:null, script: "test script 1",lastUpdateDt:"2024-08-31T12:00:47.786786",isDeleted:false},
    {lessonId:2, sampleVoicePath:null, script: "test script 2",lastUpdateDt:"2024-08-31T12:00:47.786786",isDeleted:false},
    {lessonId:3, sampleVoicePath:null, script: "test script 3",lastUpdateDt:"2024-08-31T12:00:47.786786",isDeleted:false},
    {lessonId:4, sampleVoicePath:null, script: "test script 4",lastUpdateDt:"2024-08-31T12:00:47.786786",isDeleted:false},
    {lessonId:5, sampleVoicePath:null, script: "test script 5",lastUpdateDt:"2024-08-31T12:00:47.786786",isDeleted:false},
  ];
  
  
  const handleNext = () => {
    if (currentIndex < temp_lessons.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleResult = () => {
    router.push(`${pathname}/result`);
  };

  return (
    <Box className="grid grid-cols-2 h-screen justify-center items-center">
      <Box className="grid grid-cols-1 justify-center items-center w-full h-full">
        <Box className="flex items-center p-4">
          {/* 새 이미지 */}
          <Image
            src="/images/quokka.jpg"
            alt="귀여운 쿼카"
            width={800}
            height={800}
            className="object-contain max-w-full h-auto"
          />
        </Box>
      </Box>
      <Box className="flex justify-center items-center w-full h-full">
        <Box className="bg-gray-200 p-8 md:p-16 lg:p-24 rounded shadow flex flex-col items-center justify-center w-full max-w-3xl">
          <Typography variant="h1" className="text-3xl font-bold text-black mb-2">
            {currentIndex + 1}/5
          </Typography>
          {temp_lessons.map((text, index) => (
            <Typography 
              variant="h1"
              key={text.lessonId}
              className="mb-2 text-4xl font-bold text-black"
              style={{
                display: index === currentIndex ? "block" : "none",
              }}
            >
              {text.script}
            </Typography>
          ))}
          <Box className="mt-4 flex space-x-2">
            <Button
              variant="contained"
              color={isRecording ? "error" : "success"}
              onClick={handleRecording}
            >
              {isRecording ? "녹음중" : "녹음하기"}
            </Button>
            <Button variant="contained" color="success" onClick={handleNext}>
              건너뛰기
            </Button>
            {currentIndex < temp_lessons.length - 1 ? (
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
