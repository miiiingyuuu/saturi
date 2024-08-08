"use client";

import api from "@/lib/axios";
import { SyntheticEvent, useEffect, useState } from "react";
import { LessonProps } from "@/utils/props";
import {
  Box,
  Button,
  Table,
  TableRow,
  Accordion,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function App() {
  const [lessons, setLessons] = useState<LessonProps[]>([]);
  const [expanded, setExpanded] = useState<number | false>(false);
  const [lessonDetails, setLessonDetails] = useState<{ [key: number]: any }>({});

  // 아코디언이 켜지면 상세 조회
  function handleAccordionChange(lessonId: number) {
    return async (event: SyntheticEvent, isExpanded: boolean) => {
      if (!lessonDetails[lessonId]) {
        const response = await api.get(`admin/lesson/${lessonId}`);
        setLessonDetails(prev => ({...prev, [lessonId]: response.data}));
      }
      setExpanded(isExpanded ? lessonId : false);
    };
  }

  useEffect(() => {
    api.get("/admin/lesson")
      .then(response => setLessons(response.data))
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
      .catch(err => console.log(err));
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
              <TableCell colSpan={6} style={{ padding: 0 }}>
                <Accordion
                  expanded={expanded === lesson.lessonId}
                  onChange={handleAccordionChange(lesson.lessonId)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <TableRow>
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
                  </AccordionSummary>
                  <AccordionDetails>
                    {lessonDetails[lesson.lessonId] && (
                      <Box>
                        <Typography variant="h6">상세 정보</Typography>
                        <Typography>레슨 그룹: {lessonDetails[lesson.lessonId].lessonGroupName}</Typography>
                        <Typography>원본 음성 파일 경로: {lessonDetails[lesson.lessonId].sampleVoicePath}</Typography>
                        <Typography>원본 음성 파일 이름: {lessonDetails[lesson.lessonId].sampleVoiceName}</Typography>
                        <Typography>스크립트: {lessonDetails[lesson.lessonId].script}</Typography>
                        <Typography>최근 수정된 내역: {new Date(lessonDetails[lesson.lessonId].lastUpdateDt).toLocaleString()}</Typography>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
