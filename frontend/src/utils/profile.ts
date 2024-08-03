import { getCookie, getCookies } from "cookies-next";
import api from '@/lib/axios';

// 쿠키로 프로필 사진 가져오는 요청
export async function getProfile() {
  return `/${getCookie("birdId")}.png`
}

// 모든 쿠키를 가져오기
export function getAllCookies() {
  return getCookies()
}

// 랭킹 데이터 요청
interface UserExpInfo {
  userRank: number;
}

export const getUserExpInfo = async (): Promise<UserExpInfo> => {
  try {
    const response = await api.get('/user/auth/dashboard');
    return response.data.UserExpInfo;
  } catch (error) {
    console.error('Failed to fetch user rank data:', error);
    throw error;
  }
};