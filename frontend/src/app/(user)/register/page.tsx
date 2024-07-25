"use client"

import axios from "axios";
import api from "@/lib/axios"
import { baseURL } from "@/app/constants";
import { Button, Input } from "@nextui-org/react";
import { EyeFilledIcon } from "@/assets/svg/EyeFilledIcon";
import { toggleVisibility, validateEmail } from "@/utils/utils";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { EyeSlashFilledIcon } from "@/assets/svg/EyeSlashFilledIcon";

export default function App() {
  const [ email, setEmail ] = useState("")
  const [ nickname, setNickname ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ authNumber, setAuthNumber ] = useState("")
  const [ authEmail, setAuthEmail ] = useState(false)
  const [ passwordConf, setPasswordConf ] = useState("")
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
    // TODO: then이후에 step단계 리디렉션, 즉시 로그인 및 세션, 회원정보수정으로 인식하게끔 설정
    if (nicknameValidation&&authEmail) {
    api.post("/user/auth", {
      email,
      password,
      nickname,
      locationId: 0,
      gender: 0,
      ageRange: 0
    })
      .then (response => {
        console.log(response)
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
    // TODO: 닉네임 중복확인 받아오기
    // 입력창에서도 중복 확인 한 후 새로 못적도록 고정시키기(50%완성)
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
    // TODO: 이메일 인증이랑 연결하고, 기능 만들기
    if (email==="true") {
      alert("인증되었습니다.")
      setAuthEmail(true);
    } else {
      alert("집중!")
    }
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
        <Button>
          인증번호 받기
        </Button>

        <Input
          type="text"
          label="인증번호 확인"
          className="max-w-xs"
          value={authNumber}
          onValueChange={setAuthNumber}
          variant="bordered"
        />
        <Button
          onPress={handleAuthEmail}
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