// authUtils.ts
import api from "@/lib/axios";
import { FormEvent } from "react";
import { frontURL, kakaoKey, naverKey, naverSecret } from "@/app/constants";

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

export function goKakaoLogin() {
  const redirectUrl = `${frontURL}/user/auth/login/kakao`
  window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoKey}&redirect_uri=${redirectUrl}&response_type=code`
}

export function goNaverLogin() {
  const redirectUrl = `${frontURL}/user/auth/login/naver`
  window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverKey}&client_secret=${naverSecret}&redirect_uri=${redirectUrl}&state=1234`
}