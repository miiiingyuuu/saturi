"use client";

import { useRouter } from "next/router";
import { getCookies, setCookie } from "cookies-next";
import { useCallback } from "react";
import api from "@/lib/axios";

export default function useLogout() {
  const router = useRouter();

  return useCallback(async () => {
    await api.post("/user/auth/logout");
    // 세션 스토리지에서 토큰 제거
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    const cookies = getCookies();

    // 쿠키를 가져와서 삭제
    async function deleteCookies() {
      const cookieNames = Object.keys(cookies);
      await cookieNames.reduce(async (promise, cookieName) => {
        await promise;
        setCookie(cookieName, "", { maxAge: -1 });
      }, Promise.resolve());
    }
    await deleteCookies();
    // 쿠키 삭제 후 리다이렉션
    await router.push("/");
  }, [router]);
}

// // 사용방식:
// const logout = useLogout()
//   return (
//     <Button onClick={() => {
//       authToken()
//       logout()
//       }
//     }/>
//   )
