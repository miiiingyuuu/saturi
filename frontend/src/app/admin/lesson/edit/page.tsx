"use client";

import { Container, Box, Typography} from "@mui/material";
import LessonForm from "@/components/admin/admin-form/LessonForm";

export default function App({params: {lessonId}}: {params: {lessonId: number}}) {
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
          퀴즈 수정
        </Typography>
        <LessonForm lessonId={lessonId}/>
      </Box>
    </Container>
  );
}