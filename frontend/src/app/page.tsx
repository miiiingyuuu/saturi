"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      router.push("/main");
    } else {
      router.push("/start");
    }
    setIsLoading(false); // 로딩이 끝났음을 표시
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div>Loading...</div> {/* 로딩 화면을 원하는 디자인으로 변경 가능 */}
      </div>
    );
  }

  return null; // 로딩이 끝나면 아무것도 렌더링하지 않음 (라우팅된 페이지로 이동)
}
