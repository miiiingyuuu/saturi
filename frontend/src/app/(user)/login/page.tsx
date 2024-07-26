"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@nextui-org/react";
import { EyeFilledIcon } from "@/assets/svg/EyeFilledIcon";
import { toggleVisibility, validateEmail } from "@/utils/utils";
import { EyeSlashFilledIcon } from "@/assets/svg/EyeSlashFilledIcon";
import { goKakaoLogin, goNaverLogin, handleLogin } from "@/utils/authutils";

export default function Page() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isInvalid = useMemo(() => !validateEmail(email), [email]);

  return (
    <div>
      <div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleLogin({ email, password, router, goTo:"" })
          }
          }
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
                onClick={() => toggleVisibility(setIsVisible)}
                aria-label="toggle password visibility"
              >
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

          <div className="flex items-center justify-between">
            <Button onPress={() => router.push("/register")}>회원가입</Button>
            <Button type="submit">로그인</Button>
          </div>
        </form>
      </div>
      <div className="m-width-full">
        <img
          onClick={goKakaoLogin}
          src="/kakao_login_medium_wide.png"
          alt="kakaoLogin"
        />
      </div>
      <div className="m-width-full">
        <img
          onClick={goNaverLogin}
          src="/naverBtn.png"
          alt="naverLogin"
        />
      </div>
    </div>
  );
}
