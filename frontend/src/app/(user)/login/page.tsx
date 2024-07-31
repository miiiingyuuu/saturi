"use client"

import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { validateEmail, handleValueChange } from "@/utils/utils";
import { goSocialLogin, handleLogin } from "@/utils/authutils";
import {
  Box,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { grey } from "@mui/material/colors"

export default function App() {
  const router = useRouter()

  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")
  const isEmailValid = useMemo(() => validateEmail(email),[email])

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          로그인
        </Typography>
        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            handleLogin({ email, password, router, goTo: "/main" });
          }}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="이메일"
            autoComplete="email"
            value={email}
            onChange={(event) => handleValueChange(event, setEmail)}
            autoFocus
            error={!isEmailValid}
            helperText={isEmailValid? "" : "이메일이 유효하지 않습니다."}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="비밀번호"
            type="password"
            value={password}
            onChange={(event) => handleValueChange(event, setPassword)}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              height: "56px",
            }}
          >
            로그인
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/register" variant="body2">
                계정이 없으신가요?
              </Link>
            </Grid>
          </Grid>
          <Divider
            sx={{
              mt: 2,
              color: grey[500]
            }}
          >
            또는
          </Divider>
          <Grid container spacing={1} mt={2}>
            <Grid item xs={6}>
              <img
                src="/naverBtn.png"
                alt="naverLogin"
                onClick={goSocialLogin}
                style={{
                  width: "100%",
                  height: "56px",
                  objectFit: "contain",
                  cursor: "pointer",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <img
                src="/kakao_login_medium_narrow.png"
                alt="kakaoLogin"
                onClick={goSocialLogin}
                style={{
                  width: "100%",
                  height: "56px",
                  objectFit: "contain",
                  cursor: "pointer",
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}