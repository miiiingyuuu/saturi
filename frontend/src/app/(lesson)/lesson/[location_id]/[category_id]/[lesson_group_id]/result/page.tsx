"use client";

import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import FirstResult from "../../../../../../../components/lesson/result/firstResult";
import SecondResult from "../../../../../../../components/lesson/result/secondResult";

export default function LessonResultPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [lessonGroupResultId, setLessonGroupResultId] = useState<number | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [lessonResult,setLessonResult] = useState<object>([]);
  const [userExpInfo,setUserExpInfo] = useState<object>([]);
  
  useEffect(() => {
    const lessonGroupResultIdParam = searchParams.get("lessonGroupResultId");
    if (lessonGroupResultIdParam) {
      setLessonGroupResultId(Number(lessonGroupResultIdParam));
    }
  }, [searchParams]);

  useEffect(()=>{
    api.put(`learn/lesson-group-result/${lessonGroupResultId}`)
    .then(res=>{
      if (res.status === 200){
        console.log(res)
        // setUserExpInfo(res.data.userExpInfo)
        // setLessonResult(res.data.lessonResult)
      }
    })
    .catch(err=>{
      console.log(err)
    })  
  },[])


  const nextstep = () => {
    setCurrentStep(currentStep + 1);
  };

  const beforestep = () => {
    setCurrentStep(currentStep - 1);
  };

  // const dummy = {
  //   "userExpInfo" : {
  //     "currentExp" : 80,
  //     "earnExp": 78,
  //     "resultExp" : 158,
  //   },
  //   "lessonResult" : [
  //     {
  //       "lessonId" : 1,
  //       "userVoicePath" : "사용자음성녹음파일경로",
  //       "userVoiceName" : "경상도_드라마_3_1994_그거하나몬해주나",
  //       "userScript" : "그거 하나 몬 해주나",
  //       "accentSimilarity" : 76,
  //       "pronunciationAccuracy", 84,
  //       "lessonDt" : 2024-08-07T08:24:09,
  //       "isSkipped" : false,
  //       "isBeforeResult" : boolean // 이전에 학습한결과인지(이전에 학습한거라 이번에 스킵했을 때, 이전에 학습했던
  //                                  // 레슨 결과를 보여주기 위함) ★★★ 변경사항 ★★★
  //     },
  //     {
  //       "lessonId" : 레슨고유아이디,
  //       "userVoicePath" : 사용자음성녹음파일경로,
  //       "userVoiceName" : 사용자음성녹음파일이름,
  //       "userScript" : 사용자음성스크립트,
  //       "accentSimilarity" : 파형 유사도,
  //       "pronunciationAccuracy", 발음정확도,
  //       "lessonDt" : 학습 일시,
  //       "isSkipped" : boolean(스킵했는지),
  //       "isBeforeResult" : boolean // 이전에 학습한결과인지(이전에 학습한거라 이번에 스킵했을 때, 이전에 학습했던
  //                                  // 레슨 결과를 보여주기 위함) ★★★ 변경사항 ★★★
  //     },
  //     {
  //       "lessonId" : 레슨고유아이디,
  //       "userVoicePath" : 사용자음성녹음파일경로,
  //       "userVoiceName" : 사용자음성녹음파일이름,
  //       "userScript" : 사용자음성스크립트,
  //       "accentSimilarity" : 파형 유사도,
  //       "pronunciationAccuracy", 발음정확도,
  //       "lessonDt" : 학습 일시,
  //       "isSkipped" : boolean(스킵했는지),
  //       "isBeforeResult" : boolean // 이전에 학습한결과인지(이전에 학습한거라 이번에 스킵했을 때, 이전에 학습했던
  //                                  // 레슨 결과를 보여주기 위함) ★★★ 변경사항 ★★★
  //     },
  //     {
  //       "lessonId" : 레슨고유아이디,
  //       "userVoicePath" : 사용자음성녹음파일경로,
  //       "userVoiceName" : 사용자음성녹음파일이름,
  //       "userScript" : 사용자음성스크립트,
  //       "accentSimilarity" : 파형 유사도,
  //       "pronunciationAccuracy", 발음정확도,
  //       "lessonDt" : 학습 일시,
  //       "isSkipped" : boolean(스킵했는지),
  //       "isBeforeResult" : boolean // 이전에 학습한결과인지(이전에 학습한거라 이번에 스킵했을 때, 이전에 학습했던
  //                                  // 레슨 결과를 보여주기 위함) ★★★ 변경사항 ★★★
  //     },
  //     {
  //       "lessonId" : 레슨고유아이디,
  //       "userVoicePath" : 사용자음성녹음파일경로,
  //       "userVoiceName" : 사용자음성녹음파일이름,
  //       "userScript" : 사용자음성스크립트,
  //       "accentSimilarity" : 파형 유사도,
  //       "pronunciationAccuracy", 발음정확도,
  //       "lessonDt" : 학습 일시, 
  //       "isSkipped" : boolean(스킵했는지),
  //       "isBeforeResult" : boolean // 이전에 학습한결과인지(이전에 학습한거라 이번에 스킵했을 때, 이전에 학습했던
  //                                  // 레슨 결과를 보여주기 위함) ★★★ 변경사항 ★★★
  //     }
  //   ],
  //   "lessonGroupResult" : {
  //     "lessonGroupId" : 14,
  //     "lessonGroupName" : 레슨그룹이름,
  //     "avgAccuracy" : 평균정확도,
  //     "avgSimilarity" : 평균유사도,
  //     "startDt" : 레슨 그룹 학습 시작 일시, 
  //     "endDt" : 레슨 그룹 학습 종료 일시(5문제 아직 다 안풀었으면 null),
  //     "isCompleted" : 레슨 그룹 완료 여부(5문제 다 풀었는지)
  //   }
  // }



  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      {currentStep === 1 && <FirstResult />}
      {currentStep === 2 && <SecondResult />}
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
