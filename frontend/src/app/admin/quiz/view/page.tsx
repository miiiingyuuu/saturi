"use client"

import {
  Table,
  TableBody,
  TableContainer,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TableRow,
  TableCell, Button, Checkbox, checkboxClasses, List, ListSubheader, ListItemText, ListItem, Box,
} from "@mui/material";
import api from "@/lib/axios";
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react";
import useTableSort from "@/hooks/useTableSort";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SortableTableHead from "@/components/SortableTableHead";
import { styled } from "@mui/material/styles"
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
interface QuizProps {
  quizId: number;
  locationId: number;
  question: string;
  isObjective: boolean;
  creationDt: string;
  choiceList?: Choice[];
}

interface Choice {
  choiceId: number;
  content: string;
  isAnswer: boolean;
}

type HeadCell = {
  id: keyof QuizProps;
  label: string;
};

const headCells: HeadCell[] = [
  { id: "quizId", label: "Id" },
  { id: "locationId", label: "지역" },
  { id: "creationDt", label: "생성일" },
  { id: "isObjective", label: "문제 타입" },
  { id: "question", label: "문제" },
];

const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  [`&.${checkboxClasses.root}`]: {
    color: theme.palette.primary.main, // 기본 색상
    '&.Mui-checked': {
      color: theme.palette.primary.dark, // 체크된 상태의 색상
    },
    '&.Mui-disabled': {
      color: theme.palette.primary.light, // 비활성화된 상태의 색상
    },
  },
  [`& .${checkboxClasses.disabled}`]: {
    color: theme.palette.primary.light, // 비활성화된 체크박스의 색상
  },
}));




export default function App() {
  const router = useRouter()
  const [ items, setItems] = useState<QuizProps[]>([]);
  const { rows, order, orderBy, onRequestSort } = useTableSort<QuizProps>(items, "quizId");

  // 아코디언 클릭 시 추가 데이터를 가져오는 함수
  function fetchDetail(quizId: number) {
    api.get<QuizProps>(`/admin/game/quiz/${quizId}`)
      .then(response => {
        const updatedItems = items.map((item) =>
        item.quizId === quizId ? {...item, choiceList: response.data.choiceList} : item
        )
        setItems(updatedItems);
      })
  }

  function handleEdit(quizId: number) {
    router.push(`/admin/quiz/edit/${quizId}`)
  }

  function handleDelete(quizId: number) {
    api.delete(`/admin/game/quiz/${quizId}`)
      .then(() => {
        alert("삭제되었습니다.")
        setItems(items.filter(item => item.quizId !== quizId));
      })
  }

  useEffect(() => {
    api.get("/admin/game/quiz")
      .then((response) => setItems(response.data));
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <SortableTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={onRequestSort}
          headCells={headCells}
        />
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.quizId}>
              <TableCell>{row.quizId}</TableCell>
              <TableCell>{row.locationId}</TableCell>
              <TableCell>{row.creationDt}</TableCell>
              <TableCell>{row.isObjective ? "객관식" : "주관식"}</TableCell>
              <TableCell>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    onClick={() => fetchDetail(row.quizId)}
                  >
                    <Typography>{row.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List
                      aria-labelledby="nested-list-subheader"
                      subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                          선택지
                        </ListSubheader>
                      }
                    >
                    {row.choiceList ? (
                      row.choiceList.map((choice) => (
                            <ListItem disablePadding key={choice.choiceId}>
                              <CustomCheckbox
                                disabled
                                checked={choice.isAnswer}
                              />
                              <ListItemText primary={`${choice.choiceId}번 : ${choice.content}`} />
                            </ListItem>
                      ))
                    ) : (
                      <Typography>로딩 중...</Typography>
                    )}

                    </List>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap :1,
                        mt :2,
                      }}
                    >
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleEdit(row.quizId)}
                    >
                      수정
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleDelete(row.quizId)}
                    >
                      삭제
                    </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
