"use client";

import api from "@/lib/axios";
import { authToken } from "@/utils/authutils";
import { Backdrop, CircularProgress } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

export default function App({params: {userType}}: {params: {userType: string}}) {
  const router = useRouter();
  const params = useSearchParams()

  if (params) {
    const code = params.get("code");

  if (typeof window !== "undefined") {
    api
      .post(`${process.env.NEXT_PUBLIC_BACKURL}/user/auth/login`, {
        code,
        userType: `${userType.toUpperCase()}`,
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
        })
      .catch(err => {
        alert("오류가 발생했습니다. \n 잠시 후 다시 시도해주세요.")
        router.push("/")
      });
  }
}
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
      open
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
