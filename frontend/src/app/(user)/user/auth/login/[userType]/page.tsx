"use client"

import axios from "axios"
import { baseURL } from "@/app/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// 여기로 오면 백으로 보내고 즉시 집으로 리디렉션 해주기
export default function App() {
  const pathname = usePathname()
  const router = useRouter()
  const code = useSearchParams().get('code')
  // 들어오는 주소를 파싱 (naver/kakao)
  const userType = pathname.substring(pathname.lastIndexOf('/')+1).toUpperCase()

  if (typeof window !== "undefined") {
  axios.post(`${baseURL}/user/auth/login`, {
    code,
    userType
  })
    .then((response) => {
      sessionStorage.setItem("accessToken", response.data.accessToken)
      sessionStorage.setItem("refreshToken", response.data.refreshToken)
      router.push("/")
    })
  }
  // TODO: 여기서 머무르는 시간이 있기 때문에 스피너 달아주기 
  return (
    <div>
      
    </div>
  )
}