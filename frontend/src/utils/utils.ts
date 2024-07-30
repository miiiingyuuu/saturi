import { IPasswordProps } from "@/utils/props";
import { ChangeEvent } from "react";


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

export function handleValueChange(event: ChangeEvent, setFunction: (value: string) => void) {
  setFunction(event.target.value)
}