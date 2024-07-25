"use client"

import { redirect } from "next/navigation";

export default function App() {
  // TODO : 세션 스토리지 말고 로그인 한 사람인지 알 수 있는 방법을 찾기
  // SSR 이라 클라이언트에 세션이 어떻게 생겼는지 알 방법이 없음
  // - use client 로 해결완료 -
  if (sessionStorage.getItem("accessToken")) {
    redirect("/main");
  } else {
    redirect("/start");
  }
}
