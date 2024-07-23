import axios from "axios";

const api = axios.create({
  // 포트 뭐 받는지 물어보기
  baseURL: "https://localhost:8000/saturi-api/", // 기본 URL
  timeout: 10000, // 요청 타임아웃 (밀리초 단위)
  headers: {
    "Content-Type": "application/json",
    // 기타 기본 헤더를 설정할 수 있습니다.
  },
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    // 요청을 보내기 전에 수행할 작업 (예: 인증 토큰 추가)
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;