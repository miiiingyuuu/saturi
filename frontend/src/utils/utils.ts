import { PasswordProps } from "@/utils/props";
import { ChangeEvent } from "react";

export function validateEmail(value: string): boolean {
  if (!value) return true;
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
}

export function validateNickname(value: string | null): boolean {
  if (!value) return true;
  return /^(?!.*[ㄱ-ㅎㅏ-ㅣ])[A-Za-z0-9가-힣]{1,10}$/.test(value);
}

export function validatePassword(value: string): boolean {
  if (!value) return true;
  return /^(?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&+=])(?=\S+$).{8,}$/.test(value);
}

export function passwordConfirm({ password, passwordConf }: PasswordProps) {
  return password === passwordConf;
}

export function handleValueChange(
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setFunction: (value: string) => void,
) {
  setFunction(event.target.value);
}

export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

export function parseDate(dt: string) {
  return dt.slice(2,10)
}

export function getFormattedLocationId(locationId: number) {
  switch (locationId) {
    case 1: return 'DEFAULT';
    case 2: return '경상도';
    case 3: return '경기도';
    case 4: return '강원도';
    case 5: return '충청도';
    case 6: return '전라도';
    case 7: return '제주도';
    default: return 'NULL';
  }
}