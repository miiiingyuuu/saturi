"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";

export default function LessonPage() {
  const texts = [
    { id: 1, text: "마 니 국밥 무봤나" },
    { id: 2, text: "마 니 자신있나" },
    { id: 3, text: "맛이 깔끼하네" },
    { id: 4, text: "블루베리 스무디" },
    { id: 5, text: "이거 어디까지 올라가는 거에요?" },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const router = useRouter();
  const path = usePathname();

  const handleNext = () => {
    if (currentIndex < texts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleResult = () => {
    router.push(`${path}/result`);
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="w-1/3 flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold mb-2">따봉 쿼카야 고마워</h1>
        <Image
          src="/images/quokka.jpg"
          alt="귀여운 쿼카"
          width={800}
          height={800}
          className="object-contain"
        />
      </div>
      <div className="w-2/3 flex flex-col items-center justify-center p-4 h-1/2">
        <div className="bg-gray-200 p-8 rounded shadow w-full h-full flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-black mb-2">
            {currentIndex + 1}/5
          </h1>
          {texts.map((text, index) => (
            <h1
              key={text.id}
              className={`mb-2 ${
                index === currentIndex
                  ? "text-4xl font-bold text-black"
                  : index > currentIndex
                  ? "text-lg text-gray-300"
                  : "text-xl text-gray-400"
              }`}
              style={{
                display:
                  index === currentIndex || index > currentIndex
                    ? "block"
                    : "none",
              }}
            >
              {text.text}
            </h1>
          ))}
          <div className="mt-4 flex space-x-2">
            <Button
              variant="contained"
              color={isRecording ? "error" : "success"}
              onClick={handleRecording}
            >
              {isRecording ? "녹음중" : "녹음하기"}
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleNext}
            >
              건너뛰기
            </Button>
            {currentIndex < texts.length - 1 ? (
              <Button
                variant="contained"
                color="success"
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
    </div>
  );
}
