"use client";

import { useState } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import LessonForm from "@/components/admin/admin-form/LessonForm";
import LessonGroupForm from "@/components/admin/admin-form/LessonGroupForm";

export default function App() {
  const [isLessonForm, setIsLessonForm] = useState(true);

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {isLessonForm ? "레슨 등록" : "레슨 그룹 등록"}
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => setIsLessonForm(!isLessonForm)}
        >
          {isLessonForm ? "레슨 그룹 등록으로 변경" : "레슨 등록으로 변경"}
        </Button>
        {isLessonForm ? <LessonForm /> : <LessonGroupForm />}
      </Box>
    </Container>
  );
}

// 아니면 임시비밀번호 발급 -> 주는 인증번호로 임시비밀번호를 바꿔
// >> 메일을 보내는데, 인증용 메일 가잖
// 가장 쉬운 방법: 이메일 인증 -> 새 비밀번호를 띄워줘 (??? +1!)
// 비밀번호 변경 -> 비밀번호 + 새로운 비밀번호 치고 -> 완