"use client"

import axios from "axios";
import api from "@/lib/axios"
import { baseURL } from "@/app/constants";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/utils/authutils";
import { Button, Input } from "@nextui-org/react";
import { EyeFilledIcon } from "@/assets/svg/EyeFilledIcon";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { EyeSlashFilledIcon } from "@/assets/svg/EyeSlashFilledIcon";
import {
  passwordConfirm,
  toggleVisibility,
  validateEmail,
  validatePassword } from "@/utils/utils";


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
  //
  const isEmailValid = useMemo(() => validateEmail(email), [email])
  const isPasswordConfirmed = useMemo(() => passwordConfirm({password, passwordConf}), [passwordConf])
  const isPasswordValid = useMemo(() => validatePassword(password), [password])


  // 회원가입 카운터 필요함
  function handleCounter() {
    setInterval(() => {}, 1000)
  }


  /**
   *
   * @param e
   * 회원가입 정보 보내는 함수
   * 얘는 여기서 쓰는 변수가 너무 많아서 여기다 두는게 현명할 것 같음.
   * 다른 데서 쓰지도 않으니까
   */
  function handleRegister(e: FormEvent) {
    e.preventDefault()
    // TODO: 비밀번호 유효성 확인
    // TODO: 회원가입 -> 이메일,패스워드 기반으로 로그인 요청 -> 스텝 리디렉션 -> 회원 추가정보 삽입
    if (passwordConfirm({password,passwordConf})) {
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
          handleLogin({email,password,router,goTo: "/register/stpep"})
        })
        .catch(error => console.log(error))
      } else {
        alert("인증이 완료되지 않았습니다.")
      }
    } else{
      alert("비밀번호가 일치하지 않습니다.")
    }
  }

  /**
   * 닉네임 중복확인 함수
   */
  function handleNicknameCheck() {
    // TODO : 입력창에서도 중복 확인 한 후 새로 못적도록 고정 > 중복 확인 완료 시 버튼을 비활성화 하기
    // TODO : 일차적으로 닉네임 검증 하기 ( 빈 문자열 안됨, 등 )
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
    // TODO : 버튼 광클 못하게 하기
    if (email && isEmailValid) {
      axios.get(`${baseURL}/user/auth/email-dupcheck`, {params:{
        email
        }})
        .then((response) => {
          if (response.status===200) {
            axios.post(`${baseURL}/user/auth/email-valid`,{
              email
            })
              .then((res) => {
                if (res.status === 200) {
                  alert("이메일이 발송되었습니다.\n네트워크 상황에 따라 메일 수신까지 시간이 걸릴 수 있습니다.")
                }
              })
          }
        })
        .catch (() => {
          alert("이미 존재하는 계정입니다.\n계정을 확인해 주세요.")
        })
    } else{
      alert("이메일을 확인해주세요.")
    }
  }

  function handleAuthEmailNumber() {
    // TODO : 인증하고 나면 폼 고정하기
    axios.post(`${baseURL}/user/auth/email-valid-code`, {
      email,
      authNum
    })
      .then(response => {
        if (response.status===200) {
          setIsAuthEmail(true)
          alert("인증되었습니다.")
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
          color={isEmailValid ? "default": "danger" }
          errorMessage="올바른 이메일 형식이 아닙니다."
          isInvalid={!isEmailValid}
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
          endContent={"시계 넣어야함"}
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
          color={isPasswordValid ? "default": "danger" }
          errorMessage={isPasswordValid? "사용하실 수 있습니다.": "부적절한 비밀번호입니다." }
          isInvalid={!isPasswordValid}
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
          color={isPasswordConfirmed ? "default": "danger" }
          errorMessage={isPasswordConfirmed? "비밀번호가 일치합니다.": "비밀번호가 일치하지 않습니다." }
          isInvalid={!isPasswordConfirmed}
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