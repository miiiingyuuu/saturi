"use client";

import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import FirstResult from "../../../../../../../components/lesson/result/firstResult";
import SecondResult from "../../../../../../../components/lesson/result/secondResult";



interface LessonResultProps {
  lessonId: number;
  userVoicePath: string | null;
  userVoiceName: string | null;
  userScript: string | null;
  sampleScript:string|null;
  sampleGraphX: null;
  sampleGraphY: string|null;
  accentSimilarity: number | null;
  pronunciationAccuracy: number | null;
  lessonDt: string;
  isSkipped: boolean;
  isBeforeResult: boolean;  
  userGraphX: string | null;
  userGraphY: string | null;
}

interface LessonGroupResultProps {
  lessonGroupId: number;
  lessonGroupName: string;
  avgAccuracy: number;
  avgSimilarity: number;
  startDt: string;
  endDt: string | null;
  isCompleted: boolean;
}

export default function LessonResultPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [lessonGroupResultId, setLessonGroupResultId] = useState<number | null>(
    null
  ); 

  const router = useRouter();
  const searchParams = useSearchParams();

  const [lessonResult, setLessonResult] = useState<LessonResultProps[]>([]);
  const [userExpInfo, setUserExpInfo] = useState<object>({});
  const [lessonGroupResult, setLessonGroupResult] =
    useState<LessonGroupResultProps>();

  // URL 파라미터로부터 lessonGroupResultId를 가져와 상태에 저장
  useEffect(() => {
    // searchParams가 null이 아닌 경우에만 실행
    const lessonGroupResultIdParam = searchParams?.get("lessonGroupResultId");
    if (lessonGroupResultIdParam) {
      setLessonGroupResultId(Number(lessonGroupResultIdParam));
    }
    
  }, [searchParams]);
  

  // lessonGroupResultId가 설정된 후에 API 요청 보내기
  useEffect(() => {
    if (lessonGroupResultId !== null) {
      api
        .put(`learn/lesson-group-result/${lessonGroupResultId}`)
        .then((res) => {
          if (res.status === 200) {
            console.log("lessonGroupResult",res.data);
            setUserExpInfo(res.data.userExpInfo);
            setLessonResult(res.data.lessonResult);
            setLessonGroupResult(res.data.lessonGroupResult); // lessonGroupResult 설정
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [lessonGroupResultId]); // lessonGroupResultId가 변경될 때마다 실행

  const nextstep = () => {
    setCurrentStep(currentStep + 1);
  };

  const beforestep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      {currentStep === 1 && lessonResult.length > 0 && lessonGroupResult && (
        <FirstResult
          lessonResult={lessonResult}
          lessonGroupResult={lessonGroupResult}
        />
      )}
      {currentStep === 2 && lessonGroupResult && (
        <SecondResult {...lessonGroupResult} />
      )}
      <div className="flex gap-4">
        {currentStep !== 1 && (
          <Button
            className="mt-4 bg-green-500 text-white px-8 py-4 rounded"
            onClick={beforestep}
          >
            이전
          </Button>
        )}
        {currentStep !== 2 && (
          <Button
            className="mt-4 bg-green-500 text-white px-8 py-4 rounded"
            onClick={nextstep}
          >
            다음
          </Button>
        )}
      </div>
    </div>
  );
}
