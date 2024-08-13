"use client";

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
  TableCell,
  Button,
  Checkbox,
  checkboxClasses,
  List,
  ListSubheader,
  ListItemText,
  ListItem,
  Box,
  TablePagination,
} from "@mui/material";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useTableSort from "@/hooks/useTableSort";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SortableTableHead from "@/components/SortableTableHead";
import { styled } from "@mui/material/styles";

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
    color: theme.palette.primary.main,
    "&.Mui-checked": {
      color: theme.palette.primary.dark,
    },
    "&.Mui-disabled": {
      color: theme.palette.primary.light,
    },
  },
  [`& .${checkboxClasses.disabled}`]: {
    color: theme.palette.primary.light,
  },
}));

export default function App() {
  const router = useRouter();
  const [items, setItems] = useState<QuizProps[]>([]);
  const { rows, order, orderBy, onRequestSort } = useTableSort<QuizProps>(items, "quizId");

  // Pagination 관련 상태
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // 페이지 변경 핸들러
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // 페이지 당 행 수 변경 핸들러
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function fetchDetail(quizId: number) {
    api.get<QuizProps>(`/admin/game/quiz/${quizId}`).then((response) => {
      const updatedItems = items.map((item) =>
        item.quizId === quizId ? { ...item, choiceList: response.data.choiceList } : item
      );
      setItems(updatedItems);
    });
  }

  function handleEdit(quizId: number) {
    router.push(`/admin/quiz/edit/${quizId}`);
  }

  function handleDelete(quizId: number) {
    api.delete(`/admin/game/quiz/${quizId}`).then(() => {
      alert("삭제되었습니다.");
      setItems(items.filter((item) => item.quizId !== quizId));
    });
  }

  useEffect(() => {
    api.get("/admin/game/quiz").then((response) => setItems(response.data));
  }, []);

  // 현재 페이지에 표시할 행 계산
  const displayedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
          {displayedRows.map((row) => (
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
                            <CustomCheckbox disabled checked={choice.isAnswer} />
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
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      <Button variant="contained" color="success" onClick={() => handleEdit(row.quizId)}>
                        수정
                      </Button>
                      <Button variant="contained" onClick={() => handleDelete(row.quizId)}>
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

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}
