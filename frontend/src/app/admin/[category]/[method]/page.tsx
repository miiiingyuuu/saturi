"use client";

import { Typography, Box } from "@mui/material";
import { useEffect } from "react";
import { getCookie } from "cookies-next";
import { createInfo, getInfo } from "@/utils/adminutils";
import { useRouter, usePathname } from "next/navigation";

export default function App() {
  const router = useRouter();
  const pathname = usePathname();
  const [category, method] = pathname?.split("/").slice(-2) || [];

  useEffect(() => {
    if (getCookie("role") !== "ADMIN") {
      router.push("/");
    }
    if (sessionStorage.getItem("adminToken") === "good") {
      router.push("/admin");
    }
  }, [router]);

  if (category === "lesson" && method === "create") {
    return (
      <Box>
        <Typography component="h1" variant="h5">
          레슨 등록
        </Typography>
        <form onSubmit={event => createInfo(event)}>
          <input name="" type="text" />
          <input name="" type="text" />
          <input type="file" />
          <input type="submit" />
        </form>
      </Box>
    );
  }
}
/*
                                                        큐 돌아감                  큐 잡힘         //     게임 시작
버튼 => 토큰 주고 요청 (get) => 방 아이디(서버-클라이언트) 응답 => 구독 요청 => 인원 차면 새로운 방id 응답 => 새로 구독 요청 => 새로 구독한 방에서 통신 시작

 */
