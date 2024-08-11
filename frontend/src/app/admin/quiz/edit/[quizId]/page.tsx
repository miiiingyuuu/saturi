"use client"

import { QuizIdProps } from "@/utils/props"
import QuizForm from "@/components/QuizCreateOrEdit";

export default function App({ params: { quizId } }: QuizIdProps) {

  return (
    <div>
      <QuizForm quizId={quizId}/>
    </div>
  )
}