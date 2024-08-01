"use client";

import { Button, Container, TextField, Typography, Box } from "@mui/material";
import { handleValueChange } from "@/utils/utils";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { handleLogin } from "@/utils/authutils";

export default function App() {
  const [ email, setEmail ] = useState("");
  const [ password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("accessToken")) {
      router.push("/")
    } else {
      const cookieEmail = getCookie("email")
      if (cookieEmail) {
      setEmail(cookieEmail);
      }
    }
  }, []);
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
            handleLogin({ email, password, router, goTo:"", })
          }}
          noValidate
          sx={{ mt: 1 }}
        >
          <Typography component="h1" variant="h3" align="center">
            비밀번호 확인
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
            비밀번호 확인
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
