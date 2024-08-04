import { getCookie, getCookies } from "cookies-next";
import api from '@/lib/axios';
import dashboardSample from '@/mocks/dashboard_sample.json';

// JSON 샘플 데이터


// 쿠키로 프로필 사진 가져오는 요청
export async function getProfile() {
  return `/${getCookie("birdId")}.png`
}

// 모든 쿠키를 가져오기
export function getAllCookies() {
  return getCookies()
}

// 랭킹 데이터 요청
export const getUserRank = async (): Promise<number> => {
  try {
    const accessToken = sessionStorage.getItem('accessToken');
    console.log('토큰 잘 받음')
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    // const response = await api.get('/user/auth/dashboard', {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`
    //   }
    // });
    // return response.data.userExpInfo.userRank;

    const mockResponse = {
      data: dashboardSample
    };

    return mockResponse.data.userExpInfo.userRank;
  } catch (error) {
    console.error('Failed to fetch user rank:', error);
    throw error;
  }
};