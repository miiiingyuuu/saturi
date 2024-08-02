"use client";

import api from "@/lib/axios";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Backdrop, CircularProgress } from "@mui/material";
import { authToken, insertCookie } from "@/utils/authutils";

export default function App() {
  const pathname = usePathname();
  const router = useRouter();
  const code = useSearchParams().get("code");
  const userType = pathname
    .substring(pathname.lastIndexOf("/") + 1)
    .toUpperCase();
  const [isLoading] = useState(true);

  if (typeof window !== "undefined") {
    api
      .post(`${process.env.NEXT_PUBLIC_BACKURL}/user/auth/login`, {
        code,
        userType,
      })
      .then(response => {
        sessionStorage.setItem("accessToken", response.data.accessToken);
        sessionStorage.setItem("refreshToken", response.data.refreshToken);
        authToken(router)
        router.push("/");
      });
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
