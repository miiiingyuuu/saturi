"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/utils/authutils";
import { Button, Input } from "@nextui-org/react";
import { EyeFilledIcon } from "@/assets/svg/EyeFilledIcon";
import { toggleVisibility, validateEmail } from "@/utils/utils";
import { EyeSlashFilledIcon } from "@/assets/svg/EyeSlashFilledIcon";
import { kakaoRest, frontURL } from "@/app/constants";

export default function Page() {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
    script.integrity = "sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
    script.crossOrigin = "anonymous"
    document.body.appendChild(script)
  })
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isInvalid = useMemo(() => !validateEmail(email), [email]);

  function goKakaoLogin() {
    const kakaoKey = kakaoRest
    const redirectUrl = `${frontURL}/user/auth/login/kakao`
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoKey}&redirect_uri=${redirectUrl}&response_type=code`
  }

  return (
    <div>
      <div>
        <form
          onSubmit={(event) =>
            handleLogin({ userType: "NORMAL", event, email, password, code: "", router })
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
        <Button
          onPress={goKakaoLogin}
        >
          카카오톡으로 로그인
        </Button>
      </div>
      <div>
        <Button
        >
          네이버로 로그인
        </Button>
      </div>
    </div>
  );
}
