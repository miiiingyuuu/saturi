"use client";

import { Button, Container, TextField, Typography, Box } from "@mui/material";
import { handleValueChange } from "@/utils/utils";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleAdminLogin } from "@/utils/adminutils";
import { getCookie } from "cookies-next";

// 쿠키에서 우선 검증 => admin이 아닌 경우 "/"로 보냄
// 관리자 비밀번호 검증
// 세션에서 권한 획득 ( 프론트에서 비밀번호 보관 )
// 세션에서 권한 없는 경우 "/admin" 으로 리디렉션

export default function App() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (getCookie("role") !== "ADMIN") {
      router.push("/");
    }
    if (sessionStorage.getItem("adminToken") === "good") {
      router.push("/admin");
    }
  }, [router]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Container component="main" maxWidth="sm">
        <Box
          component="form"
          onSubmit={event => {
            event.preventDefault();
            handleAdminLogin(password, router);
          }}
          noValidate
          sx={{ mt: 1 }}
        >
          <Typography component="h1" variant="h3" align="center">
            관리자 페이지 로그인
          </Typography>

          <TextField
            margin="normal"
            fullWidth
            id="password"
            label="비밀번호"
            type="password"
            value={password}
            onChange={event => handleValueChange(event, setPassword)}
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
            관리자 페이지 로그인
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
