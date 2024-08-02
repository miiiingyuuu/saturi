import { getCookie, getCookies } from "cookies-next";
import axios from 'axios';

// 쿠키로 프로필 사진 가져오는 요청
export async function getProfile() {
  return `/${getCookie("birdId")}.png`
}

// 모든 쿠키를 가져오기
export function getAllCookies() {
  return getCookies()
}

// 프로필 수정 요청 보내기
export function putProfile() {

}