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
  TableCell, Button,
} from "@mui/material";
import api from "@/lib/axios";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import useTableSort from "@/hooks/useTableSort";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SortableTableHead from "@/components/SortableTableHead";

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

export default function App() {
  const router = useRouter()
  const [items, setItems] = useState<QuizProps[]>([]);
  const { rows, order, orderBy, onRequestSort } = useTableSort(items, "quizId");

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
    router.push(`/admin/game/quiz/edit/${quizId}`)
  }

  function handleDelete(quizId: number) {
    api.delete(`/admin/game/quiz/${quizId}`)
      .then(() => {
        alert("삭제되었습니다.")
        setItems(items.filter(item => item.quizId !== quizId));
      })
  }

  useEffect(() => {
    api.get("/admin/game/quiz/").then((response) => setItems(response.data));
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
                    <Typography>선택지:</Typography>
                    {row.choiceList ? (
                      row.choiceList.map((choice) => (
                        <Typography key={choice.choiceId}>
                          {choice.content} {choice.isAnswer ? "(정답)" : ""}
                        </Typography>
                      ))
                    ) : (
                      <Typography>로딩 중...</Typography>
                    )}
                    <Button
                      onClick={() => handleEdit(row.quizId)}
                    >
                      수정
                    </Button>
                    <Button
                      onClick={() => handleDelete(row.quizId)}
                    >
                      삭제
                    </Button>
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
