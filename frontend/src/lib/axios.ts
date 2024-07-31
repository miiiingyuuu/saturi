import axios from "axios";

const api = axios.create({
  baseURL : process.env.NEXT_PUBLIC_BACKURL,
  timeout: 10000,
  // 기본으로 넣어줘야할 헤더
  headers: {
    "Content-Type": "application/json",
  },
});


/*
request
1. onFullfilled (config) => 요청이 전달 되기 직전 작업을 수행한다.
2. onRejected (error) => 요청에 오류가 있는경우 전달 전에 작업을 수행한다.
구조:
api.interceptors.request.use(
  config => {
    return config
  },
  error => Promise.reject(error)
)
 */

api.interceptors.request.use(
  (config) => {
    // 엑세스 토큰을 세션 스토리지에서 가져오고,
    const token = sessionStorage.getItem("accessToken");
    const refreshToken = sessionStorage.getItem("refreshToken");
    // 토큰이 있으면 토큰을 넣어서 요청을 보냅니다.
    if (token) {
      config.headers.Authorization = `${token}`;
      config.headers.accessToken = `${token}`;
      config.headers.refreshToken = `${refreshToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



/*
repsonse
1. onFulfilled : 응답 데이터가 있는 경우
2. onReject : 응답 오류가 있는 경우

status에 따라 넘기는 페이지를 설정할 수 있다.
api.interceptors.response.use(
  response => {
    if (response.status===404) {
        router.push("/error")
      }
  return response
  }
  // 에러로 인해 중단된 요청을 토큰 갱신 후 재요청 하는 경우
  async error => {
    if (error.response?.status === 401) {
      if (isTokenExpired() await tokenRefresh()) {
        const accessToken = getToken()

        error.config.headers = {
          "content-Type: "application/json",
          // 리프레시 토큰 변수 확인하기
          refreshToken: `${accessToken}`,
        }

        const response = await axios.request(error.config)
        return response
      }
      return Promise.reject(error)
    }
  }
)
 */

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;