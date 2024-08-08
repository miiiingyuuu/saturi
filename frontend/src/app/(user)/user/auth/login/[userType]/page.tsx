"use client";

import api from "@/lib/axios";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Backdrop, CircularProgress } from "@mui/material";
import { authToken, insertCookie } from "@/utils/authutils";
import { getCookie } from "cookies-next";

export default function App() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams()
  const [isLoading] = useState(true);
  
  if (pathname&&params) {
  const code = params.get("code");
  const userType = pathname
    .substring(pathname.lastIndexOf("/") + 1)
    .toUpperCase();

  if (typeof window !== "undefined") {
    api
      .post(`${process.env.NEXT_PUBLIC_BACKURL}/user/auth/login`, {
        code,
        userType,
      })
      .then(response => {
        sessionStorage.setItem("accessToken", response.data.accessToken);
        sessionStorage.setItem("refreshToken", response.data.refreshToken);
        authToken()

        api.get("user/auth/profile")
          .then(response => {
            if (response.data.nickname === null) {
              alert("닉네임을 설정해주세요.")
              router.push("/user/profile/update")
            }
            }
          )

        router.push("/");
      });
  }
}
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
