"use client";

import api from "@/lib/axios";
import { SyntheticEvent, useEffect, useState } from "react";
import { QuizProps } from "@/utils/props";
import {
  Box,
  Table,
  Button,
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
  const [quizzes, setQuizzes] = useState<QuizProps[]>([]);
  const [expanded, setExpanded] = useState<number | false>(false);
  const [quizDetails, setQuizDetails] = useState<{ [key: number]: any }>({});

  // 아코디언이 켜지면 상세 조회 ㄱ
  function handleAccordionChange(quizId: number) {
    return async (event: SyntheticEvent, isExpanded: boolean) => {
      if (!quizDetails[quizId]) {
        const response = await api.get(`admin/game/quiz/${quizId}`);
        setQuizDetails(prev => ({...prev, [quizId]: response.data}));
      }
      setExpanded(isExpanded ? quizId : false)
    }
  }

  function deleteQuiz(quizId: number) {
    api.delete(`/admin/game/quiz/${quizId}`)
      .then(() => {
          setQuizzes(quizzes.filter(quiz => quiz.quizId !== quizId));
        }
      )
  }

  useEffect(() => {
    api.get("/admin/game/quiz")
      .then(response => setQuizzes(response.data));
  }, []);

  return (
    <Box>
      <Typography component="h1" variant="h5">
        퀴즈 조회
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>지역</TableCell>
            <TableCell>질문</TableCell>
            <TableCell>등록일자</TableCell>
            <TableCell>주관식/객관식</TableCell>
            <TableCell>수정/삭제</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {quizzes.map((quiz) => (
            <TableRow key={quiz.quizId}>
              <TableCell colSpan={6} style={{ padding: 0 }}>
                <Accordion
                  expanded={expanded === quiz.quizId}
                  onChange={handleAccordionChange(quiz.quizId)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <TableCell>{quiz.quizId}</TableCell>
                    <TableCell>{quiz.locationId}</TableCell>
                    <TableCell>{quiz.question}</TableCell>
                    <TableCell>{new Date(quiz.creationDt).toLocaleString()}</TableCell>
                    <TableCell>{quiz.isObjective ? "객관식" : "주관식"}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => deleteQuiz(quiz.quizId)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </AccordionSummary>
                  <AccordionDetails>
                    {quizDetails[quiz.quizId] && (
                      <>
                        <Typography variant="h6">상세 정보</Typography>
                        <Typography>질문: {quizDetails[quiz.quizId].question}</Typography>
                        {quizDetails[quiz.quizId].choiceList && (
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>선택지</TableCell>
                                <TableCell>답변</TableCell>
                                <TableCell>정답여부</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {quizDetails[quiz.quizId].choiceList.map((choice: any) => (
                                <TableRow key={choice.choiceId}>
                                  <TableCell>{choice.choiceId}</TableCell>
                                  <TableCell>{choice.content}</TableCell>
                                  <TableCell>{choice.isAnswer ? "Yes" : "No"}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </>
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
