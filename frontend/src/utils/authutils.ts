// authUtils.ts
import api from "@/lib/axios";
import { IHandleLogin } from "@/utils/props";
import { frontURL, kakaoKey, naverKey, naverSecret } from "@/app/constants";


// 로그인
export function handleLogin({ email, password, router, goTo }: IHandleLogin) {
  api.post("/user/auth/login", {
    email,
    password,
    userType: "NORMAL"
  })
    .then((response) => {
      sessionStorage.setItem("accessToken", response.data.accessToken);
      sessionStorage.setItem("refreshToken", response.data.refreshToken);
      router.push(`${goTo}`)
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
  window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverKey}&client_secret=${naverSecret}&redirect_uri=${redirectUrl}&state=8697240`
}