// app/utils/profileImage.ts
import api from "@/lib/axios";

export const getProfileImage = async (accessToken: string) => {
  try {
    const response = await api.get("/user/auth/profile", {});
    return "/btnG_로그아웃.png";
    // DB 연결 시 아래 경로 변경 필요
    // return response.data.birdImagePath; // 서버가 birdImagePath를 반환한다고 가정
  } catch (error) {
    console.error("Failed to fetch profile image by access token", error);
    throw error;
  }
};
