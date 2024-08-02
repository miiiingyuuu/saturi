"use client";

import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { LessonProps } from "@/utils/props"
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";



export default function App() {
  const [lessons, setLessons] = useState<LessonProps[]>([]);

  useEffect(() => {
    api.get("/admin/lesson")
      .then(response => {
        setLessons(response.data);
      })
      .catch(err => console.log(err))
  }, []);

  const handleEdit = (lessonId: number) => {
    // Edit functionality here
    console.log("Edit:", lessonId);
  };

  function handleDelete(lessonId: number) {
    // Delete functionality here
    api.delete(`/admin/lesson/${lessonId}`)
      .then(() => {
        setLessons(lessons.filter(lesson => lesson.lessonId !== lessonId));
      })
      .catch(err => console.log(err))
  };

  return (
    <Box>
      <Typography component="h1" variant="h5">
        레슨 조회
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>레슨 ID</TableCell>
            <TableCell>레슨 그룹</TableCell>
            <TableCell>Sample Voice Path</TableCell>
            <TableCell>스크립트</TableCell>
            <TableCell>등록일자</TableCell>
            <TableCell>수정/삭제</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lessons.map((lesson) => (
            <TableRow key={lesson.lessonId}>
              <TableCell>{lesson.lessonId}</TableCell>
              <TableCell>{lesson.lessonGroupName}</TableCell>
              <TableCell>{lesson.sampleVoicePath}</TableCell>
              <TableCell>{lesson.script}</TableCell>
              <TableCell>{new Date(lesson.lastUpdateDt).toLocaleString()}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleEdit(lesson.lessonId)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleDelete(lesson.lessonId)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
