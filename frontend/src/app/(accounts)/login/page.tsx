"use client"

import api from "@/lib/axios"
import { signIn } from "next-auth/react"
import { useState, useMemo, FormEvent } from "react";
import { Button, Input } from "@nextui-org/react";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter()
  const [ isVisible, setIsVisible ] = useState(false);
  const [ email,setEmail ] = useState("");
  const [ password, setPassword ] = useState("");

  function validateEmail (value: string){
    if (!value) return true;
    return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)
  }

  const isInvalid = useMemo(() => !validateEmail(email), [email])

  function toggleVisibility () {
    setIsVisible((prev) => !prev)
  }

  /**
   *
   * @param event 로그인 클릭 시
   *
   * 미리 만든 axiosInsatnce를 통해서 user/auth/login으로 {email,password,useType} post
   */
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    // 호출 전에 유효성 검사 하기
    api.post("/user/auth/login", {
      email,
      password,
      userType: "NORMAL",
    })
      .then(
        // 여기에서 검증 후 토큰이든 세션이든 뭐든 발급 후 넘어가기
      (response) => {
        console.log(response)
      }
    )
      .catch(
        e => console.log(e)
      )
  }


  return (
    <div>
      <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center"
      >
        <Input
          value={email}
          onValueChange={setEmail}
          type="email"
          label="Email"
          variant="bordered"
          className="max-w-xs"
          color={isInvalid ? "danger" : "default"}
          errorMessage="올바른 이메일 형식이 아닙니다."
          isInvalid={isInvalid}
        />
        <Input
          label="Password"
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

        <br />

        <hr />

        <br />

        <div
          className = "flex items-center justify-between"
        >
          <Button
            onPress={() => {
              router.push("/register")
            }}
          >
            회원가입
          </Button>          
          <Button
            type="submit"
          >
            로그인
          </Button>
        </div>
      </form>
      </div>
      <div
        className = "m-width-full"
      >
      <Button
        onClick = {
          () => signIn("kakao", {
            redirect: true,
            callbackUrl: "/",
          })
        }
      >
        카카오톡으로 로그인
      </Button>
      </div>
      <div>
      <Button
        onClick = {
          () => signIn("naver", {
            redirect: true,
            callbackUrl: "/",
          })
        }
      >
        네이버로 로그인
      </Button>
      </div>
    </div>
  )
}
