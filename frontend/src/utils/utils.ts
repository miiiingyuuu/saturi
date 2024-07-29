import { IPasswordProps } from "@/utils/props";

export function toggleVisibility(setIsVisible: (value: (prev: boolean) => boolean) => void) {
  setIsVisible((prev: boolean) => !prev);
}

export function validateEmail(value: string): boolean {
  if (!value) return true;
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
}

export function validateNickname(value: string): boolean {
  if (!value) return true;
  return /^(?!.*[ㄱ-ㅎㅏ-ㅣ])[A-Za-z0-9가-힣]{1,10}$/.test(value);
}

export function validatePassword(value: string): boolean {
  if (!value) return true
  return /^(?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&+=])(?=\S+$).{8,}$/.test(value);
}

export function passwordConfirm({password, passwordConf}: IPasswordProps) {
  return password===passwordConf
}