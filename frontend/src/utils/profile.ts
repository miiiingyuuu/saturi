import { getCookie, getCookies } from "cookies-next";

export async function getProfile() {
  return `/bird/${getCookie("birdId")}.png`
}

export function getAllCookies() {
  return getCookies()
}