"use client"

import axios from "axios";
import api from "@/lib/axios"
import { baseURL } from "@/app/constants";
import { useRouter } from "next/navigation";
import { Button, Input } from "@nextui-org/react";
import { EyeFilledIcon } from "@/assets/svg/EyeFilledIcon";
import { toggleVisibility, validateEmail } from "@/utils/utils";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { EyeSlashFilledIcon } from "@/assets/svg/EyeSlashFilledIcon";

export default function App() {
  const router = useRouter()
  const [ email, setEmail ] = useState("")
  const [ nickname, setNickname ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ isAuthEmail, setIsAuthEmail ] = useState(false)
  const [ passwordConf, setPasswordConf ] = useState("")
  const [ authNum, setAuthNum ] = useState("")
  const [ isVisible, setIsVisible ] = useState(false)
  const [ isConfVisible, setIsConfVisible ] = useState(false)
  const [ nicknameValidation, setNicknameValidation ] = useState(false)

  const isInvalid = useMemo(() => !validateEmail(email), [email])

  /**
   * 
   * @param e 
   * 회원가입 정보 보내는 함수
   */
  function handleRegister(e: FormEvent) {
    e.preventDefault()
    // TODO: 비밀번호 확인 제대로 체크 안했음
    if (nicknameValidation&&isAuthEmail) {
    api.post("/user/auth", {
      email,
      password,
      nickname,
      locationId: 1,
      gender: 0,
      ageRange: 0
    })
      .then (response => {
        alert("회원가입이 완료되었습니다.")
        router.push("/register/step")
      })
      .catch(error => console.log(error))
    } else {
      alert("닉네임 체크, 이메일 체크 확인")
    }
  }

  /**
   *
   * 닉네임 중복확인 함수
   * 그냥 주소 기본으로 받아서 만들긴 했는데, 나중에 axios 만든거랑 합쳐야함
   *
   */
  function handleNicknameCheck() {
    // TODO : 입력창에서도 중복 확인 한 후 새로 못적도록 고정시키기(50%완성)
    axios.get(`${baseURL}/user/auth/nickname-dupcheck`, {params: {
      nickname}
    })
      .then(response => {
        if (response) {
          if (window.confirm("이 닉네임을 사용하시겠습니까?")) {
          setNicknameValidation(true)
            }
          }
      })
      .catch(err => {alert("중복된 닉네임입니다.")})
  }
  // 인증 이후에도 닉네임을 수정 검증이 취소되도록 작업
  useEffect(() => {
    setNicknameValidation(false)
  },[nickname])


  function handleAuthEmail() {
    axios.get(`${baseURL}/user/auth/email-dupcheck`, {params:{
      email
      }})
      .then((response) => {
        if (response.status===200) {
          axios.post(`${baseURL}/user/auth/email-valid`,{
            email
          })
        }
      })
  }

  function handleAuthEmailNumber() {
    axios.post(`${baseURL}/user/auth/email-valid-code`, {
      email,
      authNum
    })
      .then(response => {
        if (response.status===200) {
          setIsAuthEmail(true)
        }
      })
      .catch(err =>
      alert("인증번호가 틀립니다.")
      )
  }
  
  return (
    <div>
      <form
        onSubmit={handleRegister}
      >
        <Input
          value={email}
          onValueChange={setEmail}
          type="email"
          label="이메일"
          variant="bordered"
          color={isInvalid ? "danger" : "default"}
          errorMessage="올바른 이메일 형식이 아닙니다."
          isInvalid={isInvalid}
          className="max-w-xs"
        />
        <Button
          onPress={handleAuthEmail}
        >
          인증번호 받기
        </Button>

        <Input
          type="text"
          label="인증번호 확인"
          className="max-w-xs"
          value={authNum}
          onValueChange={setAuthNum}
          variant="bordered"
        />
        <Button
          onPress={handleAuthEmailNumber}
        >
          인증하기
        </Button>
        <Input
          label="비밀번호"
          variant="bordered"
          value={password}
          onValueChange={setPassword}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() => toggleVisibility(setIsVisible)}
              aria-label="toggle password visibility">
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="max-w-xs"
        />

        <Input
          label="비밀번호 확인"
          variant="bordered"
          value={passwordConf}
          onValueChange={setPasswordConf}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() => toggleVisibility(setIsConfVisible)}
              aria-label="toggle password visibility">
              {isConfVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isConfVisible ? "text" : "password"}
          className="max-w-xs"
        />
        
        <Input
          type="text"
          label="별명"
          className="max-w-xs"
          value={nickname}
          onValueChange={setNickname}
          variant="bordered"
          
        />
        <Button
          onPress={handleNicknameCheck}
        >중복확인</Button>

        <Button
          type="submit"
        >
          가입
        </Button>
      </form>
    </div>
  )
}