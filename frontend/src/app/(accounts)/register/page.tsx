"use client"

import axios from "axios";
import api from "@/lib/axios"
import { Button, Input } from "@nextui-org/react";
import { FormEvent, useMemo, useState } from "react";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";


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
  
  function validateEmail (value: string){
    if (!value) return true;
    return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)
  }

  const isInvalid = useMemo(() => !validateEmail(email), [email])

  function toggleVisibility() {
    setIsVisible((prev) => !prev)
  }

  function toggleConfVisibility() {
    setIsConfVisible((prev) => !prev)
  }

  /**
   * 
   * @param e 
   * 회원가입 정보 보내는 함수
   * TODO)
   * then 이후에 뭐든 해주고, step단계로 리디렉션 해줘야함
   * 로그인 해서 세션도 받아가지고, 그 아이디의 회원 정보 수정으로 인식되게 해야함
   */
  function handleRegister(e: FormEvent) {
    e.preventDefault()
    if (nicknameValidation&&authEmail) {
    api.post("/user/auth", {
      email,
      password,
      nickname
    })
      .then (response => {
        console.log(response)
      })
    }
  }

  /**
   * 
   * @param e 
   * 
   * 닉네임 중복확인 함수
   * 그냥 주소 기본으로 받아서 만들긴 했는데, 나중에 axios 만든거랑 합쳐야함
   * 
   */
  function handleNickNameCheck() {
    axios({
      method: "GET",
      url: `${API_URL}/saturi-api/user/auth/nickname-dupcheck`,
      params: {nickname}
    })
      // 닉네임 중복확인 대강 받아오기
      // 입력창에서도 중복확인한 이후엔 새로 못적도록 고정시키기
      .then(response => {
        if (response) {
          if (window.confirm("이 닉네임을 사용하시겠습니까?")) {
          setNicknameValidation(true)
          }
        }
      })
  }

  function handleAuthEmail() {
    if ("뭐 대충 인증이 되었다면") {
      window.alert("인증되었습니다.")
      setAuthEmail(true);
    } else {
      window.alert("집중!")
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
              onClick={toggleVisibility}
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
              onClick={toggleConfVisibility}
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
          onPress={handleNickNameCheck}
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