"use client"

import api from "@/lib/axios"
import { useRouter } from "next/navigation"
import { handleLogin } from "@/utils/authutils"
import { FormEvent, useMemo, useState, MouseEvent } from "react"
import {
  validateEmail,
  passwordConfirm,
  validatePassword,
  validateNickname,
  handleValueChange,
} from "@/utils/utils";
import {
  Box,
  Grid,
  Button,
  Container,
  TextField,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";


export default function App() {
  const router = useRouter()

  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ nickname, setNickname ] = useState("")
  const [ passwordConf, setPasswordConf ] = useState("")

  const [ isAuthEmail, setIsAuthEmail ] = useState(false)
  const [ isEmailSend, setIsEmailSend ] = useState(false)
  const [ isNicknameChecked, setIsNicknameChecked] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)

  const isEmailValid = useMemo(() => validateEmail(email), [email])
  const isPasswordValid = useMemo(() => validatePassword(password), [password])
  const isPasswordConfirmed = useMemo(() => passwordConfirm({ password, passwordConf }), [passwordConf])
  const isNicknameValid = useMemo(() => validateNickname(nickname), [nickname])

  function handleRegister(e: FormEvent) {
    e.preventDefault()
    // TODO: 회원가입 -> 이메일,패스워드 기반으로 로그인 요청 -> 스텝 리디렉션 -> 회원 추가정보 삽입
    let error = ""

    // eslint-disable-next-line default-case
    switch (true) {
      case !isAuthEmail:
        error = "이메일 인증을 해주세요."
        break
      case !password:
        error = "비밀번호를 입력해주세요."
        break
      case !passwordConfirm({ password, passwordConf }):
        error = "비밀번호가 일치하지 않습니다."
        break
      case !isNicknameChecked:
        error = "별명 중복 확인을 해주세요."
        break
    }

    if (error) {
      alert(error)
      return
    }

    api.post("/user/auth", {
      email,
      password,
      nickname,
      locationId: 1,
    })
      .then(() => {
        alert("회원가입이 완료되었습니다.")
        handleLogin({ email, password, router, goTo: "/register/step" })
      })
      .catch(error => console.log(error))
  }
    

  function handleAuthEmail() {
    if (email && isEmailValid) {
      setIsLoading(true)
      api.get("/user/auth/email-dupcheck", {params: {
        email
        }})
          .then((response) => {
            if (response.status===200) {
              api.post("/user/auth/email-valid",{
                email
            })
              .then((res) => {
                if (res.status === 200) {
                  setIsLoading(false)
                  setIsEmailSend(true)
                  alert("이메일이 발송되었습니다.\n네트워크 상황에 따라 메일 수신까지 시간이 걸릴 수 있습니다.")
                }
              })
          }
        })
        .catch (() => {
          setIsLoading(false)
          alert("이미 존재하는 계정입니다.\n계정을 확인해 주세요.")
        })
    } else {
      alert("이메일을 확인해주세요.")
    }
  }



  function handleAuthEmailNumber(event: MouseEvent) {
    const data = new FormData((event.currentTarget as HTMLButtonElement).form!)
    const authNum = data.get("authNum")
    api.post("user/auth/email-valid-code", {
      email,
      authNum
    })
      .then(response => {
        if (response.status===200) {
          setIsAuthEmail(true)
          alert("인증되었습니다.")
        }
      })
      .catch((err) => {
        console.log(err)
        alert("인증번호가 틀립니다.")
        }
      )
  }

  function handleAuthNickname(event: MouseEvent) {
    event.preventDefault()
    if (isNicknameValid) {
      api.get("/user/auth/nickname-dupcheck", {params: {
        nickname
        }})
        .then(response => {
          if (response) {
            if (window.confirm("이 닉네임을 사용하시겠습니까?")) {
              setIsNicknameChecked(true)
            }
          }
        })
        .catch(error => console.log(error))
      } else {
        alert("유효하지 않은 닉네임 입니다.")
    }
  }

  return (
      <Container component="main" maxWidth="xs">
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
          <CircularProgress color="inherit"/>
        </Backdrop>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            회원가입
          </Typography>
          <Box component="form" noValidate onSubmit={handleRegister} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="이메일"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={event => handleValueChange(event, setEmail)}
                  error={!isEmailValid}
                  helperText={isEmailValid? "" : "이메일이 유효하지 않습니다."}
                  disabled={isAuthEmail}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  autoComplete="off"
                  name="authNum"
                  required
                  fullWidth
                  id="authNum"
                  label="이메일 인증"
                  autoFocus
                  disabled={isAuthEmail}
                />
              </Grid>
              <Grid item xs={4}>
                {!isEmailSend?
                <Button
                  onClick={handleAuthEmail}
                  fullWidth
                  variant="contained"
                  disabled={isAuthEmail}
                  sx={{
                    fontSize: "0.75rem",
                    height: "56px"
                  }}
                >
                  인증번호 받기
                </Button> :
                  <Button
                    onClick={handleAuthEmailNumber}
                    fullWidth
                    variant="contained"
                    sx={{
                      fontSize: "0.75rem",
                      height: "56px"
                    }}
                  >
                    인증번호 확인
                  </Button>
                }
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="비밀번호"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => {handleValueChange(event, setPassword)}}
                  error={!isPasswordValid}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordConf"
                  label="비밀번호 확인"
                  type="password"
                  id="passwordConf"
                  value={passwordConf}
                  onChange={(event) => {handleValueChange(event, setPasswordConf)}}
                  error={!isPasswordConfirmed}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  name="nickname"
                  required
                  fullWidth
                  id="nickname"
                  label="별명"
                  value = {nickname}
                  onChange = {event => handleValueChange(event, setNickname)}
                  autoFocus
                  disabled={isNicknameChecked}
                  error={!isNicknameValid}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={isNicknameChecked}
                  onClick={handleAuthNickname}
                  sx={{
                    fontSize: "0.75rem",
                    height: "56px"
                  }}
                >
                  중복 확인
                </Button>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                fontSize: "1rem",
                height: "56px"
              }}
            >
              회원가입
            </Button>
          </Box>
        </Box>
      </Container>
  );
}