"use client"

import { useRouter } from "next/navigation"
import { getCookies, setCookie } from "cookies-next"
import { Button } from "@mui/material"

export default function useLogout() {

  const router = useRouter()

  async function handleLogout () {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");

  const cookies = getCookies();

  async function deleteCookies() {
    for (const cookieName in cookies) {
      if (Object.prototype.hasOwnProperty.call(cookies, cookieName)) {
        setCookie(cookieName, '', { maxAge: -1 });
      }
    }
  }

  await deleteCookies();

  router.push("/")

  }
  return (
    <Button onClick={handleLogout}>
      로그아웃
    </Button>
  )
}