"use client"

import axios from "axios"
import { baseURL } from "@/app/constants";
import { useRouter, useSearchParams } from "next/navigation";

// 여기로 오면 백으로 보내고 즉시 집으로 리디렉션 해주기
export default function App() {
  const code = useSearchParams().get('code')
  const router = useRouter()

  if (typeof window !== "undefined") {
    // 클라이언트 사이드에서만 실행될 코드

  axios.post(`${baseURL}/user/auth/login`, {
    email: "",
    password: "",
    code,
    userType: "KAKAO"
  })
    .then((response) => {
      console.log(response)
      sessionStorage.setItem("accessToken", response.data.accessToken)
      sessionStorage.setItem("refreshToken", response.data.refreshToken)
      router.push("/")
    })
    .catch(e => console.log(e))
  }

}