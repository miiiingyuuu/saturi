"use client";

import { useRouter } from "next/navigation";
import { deleteCookie, getCookies } from "cookies-next";
import { useCallback } from "react";
import api from "@/lib/axios";

export default function useLogout() {
  const router = useRouter();

  return useCallback(async () => {
    await api.post("/user/logout");
    // 세션 스토리지에서 토큰 제거
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("adminToken");
    const cookies = getCookies();

    // 쿠키를 가져와서 삭제
    async function deleteCookies() {
      const cookieNames = Object.keys(cookies);
      await cookieNames.reduce(async (promise, cookieName) => {
        await promise;
        deleteCookie(cookieName);
      }, Promise.resolve());
    }
    await deleteCookies();
    // 쿠키 삭제 후 리다이렉션
    window.location.href =`${process.env.NEXT_PUBLIC_FRONTURL}`

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
