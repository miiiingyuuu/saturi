// authUtils.ts
import api from "@/lib/axios";
import { FormEvent } from "react";

interface IHandleLogin {
  userType: string
  event: FormEvent
  email: string
  password: string
  code: string
  router: any
}

export function handleLogin({userType, event, email, password, code, router }: IHandleLogin) {
  event.preventDefault();

  api.post("/user/auth/login", {
    email,
    password,
    userType,
  })
    .then((response) => {
      sessionStorage.setItem("accessToken", response.data.accessToken);
      sessionStorage.setItem("refreshToken", response.data.refreshToken);
      router.push("/")
    })
    .catch((error) => {
      console.log(error)
    })
}

export function handleSocialLogin({userType, event, email, password, code, router}: IHandleLogin) {
  event.preventDefault()

  api.post("user/auth/login", {
    code,
    userType
  })
    .then((response) => {
      // 여기서 토큰 삽입
      console.log(response)
      router.push("/")
    })
    .catch((error) => {
      console.log(error)
    })
}