"use client"

import { useRouter } from "next/navigation"

// 여기로 오면 백으로 보내고 즉시 집으로 리디렉션 해주기
export default function App() {
  const router = useRouter()
  console.log(router)
}