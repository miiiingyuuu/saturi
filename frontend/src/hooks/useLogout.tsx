"use client";

import api from "@/lib/axios";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { frontLogOut } from "@/utils/authutils";


export default function useLogout() {
  const router = useRouter();

  return useCallback(() => {
    api.post("/user/logout");
    frontLogOut()

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
