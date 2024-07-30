import api from "@/lib/axios";
import { IHandleLogin } from "@/utils/props";
import { setCookie } from "cookies-next";

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
// 카카오 로그인
export function goKakaoLogin() {
  console.log("goKakaoLogin 호출");
  const redirectUrl = `${process.env.NEXT_PUBLIC_FRONTURL}/user/auth/login/kakao`
  window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAOSECRET}&redirect_uri=${redirectUrl}&response_type=code`
}
// 네이버 로그인
export function goNaverLogin() {
  const redirectUrl = `${process.env.NEXT_PUBLIC_FRONTURL}/user/auth/login/naver`
  window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_NAVERKEY}&client_secret=${process.env.NEXT_PUBLIC_NAVERSECRET}&redirect_uri=${redirectUrl}&state=8697240`
}

// 토큰 유효성 확인
// 페이지 옮길때마다 실행 (메인의 authutils에 달려있음)
export function authToken() {
  // 우선 토큰 유효성 검사
  api.get("/user/auth/token-check")
    .then( response => {
      if (response.status === 200) {
        api.get("user/auth/profile",
        )
          .then( res => {
            // 유효성 검사 후, 받아온 데이터를 쿠키에 저장
            setCookie("nickname", res.data.nickname)
            setCookie("email", res.data.email)
            }
          )
      }
    })
    .catch( err => {
        // 401 에러 발생 시
        if (err.response.status === 401) {
          // 리프레시 토큰을 들고 토큰 리프레시 신청하러감
          api.post("/user/auth/token-refresh", {} , {headers: {refreshToken: `${sessionStorage.getItem("refreshToken")}`}})
            .then( response => {
              sessionStorage.setItem("accessToken", response.data.accessToken);
            })
            // 만약 여기서도 401 뜨면, 로그아웃 처리 하고 로그인으로 보내기
            .catch( err => {
              console.log(err)
            })
        }
    })
}

// 회원 정보 수정
export function updateUser(data: object) {
  // 이미 엑세스 토큰을 머리에 달고 있음
  // 기타 정보는 쿠키에 담겨 있음
  api.put("/user/auth", data)
    .then(response => console.log(response))
  // 여기 반환해야 할게 있나?
}