"use client"

import { QuizIdProps } from "@/utils/props"
import QuizForm from "@/components/admin/admin-form/QuizForm";

export default function App({ params: { quizId } }: QuizIdProps) {

  return (
    <div>
      <QuizForm quizId={quizId}/>
    </div>
  )
}