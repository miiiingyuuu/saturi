"use client";

import { Button } from "@nextui-org/react";
import { useState } from "react";
import FirstResult from "../../../../../../../components/lesson/result/firstResult";
import SecondResult from "../../../../../../../components/lesson/result/secondResult";

export default function LessonResultPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const nextstep = () => {
    setCurrentStep(currentStep + 1);
  };
  const beforestep = () => {
    setCurrentStep(currentStep - 1);
  };
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
