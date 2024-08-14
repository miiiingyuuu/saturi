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
  TableCell,
  Button, TablePagination,
} from "@mui/material";
import api from "@/lib/axios";
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react";
import useTableSort from "@/hooks/useTableSort";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SortableTableHead from "@/components/SortableTableHead";
import AdminSampleGraph from "@/components/admin/AdminSampleGraph"
import {LessonProps} from "@/utils/props"

type HeadCell = {
  id: keyof LessonProps | "actions";
  label: string;
};

const headCells: HeadCell[] = [
  { id: "lessonId", label: "레슨 Id" },
  { id: "lessonGroupId", label: "레슨 그룹 Id" },
  { id: "lessonGroupName", label: "레슨 그룹" },
  { id: "script", label: "스크립트" },
  { id: "lastUpdateDt", label: "최종 수정일" },
];

export default function App() {
  const router = useRouter()
  const [ items, setItems] = useState<LessonProps[]>([]);
  const { rows, order, orderBy, onRequestSort } = useTableSort<LessonProps>(items, "lessonId");

  // Pagination 관련 상태
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // 현재 페이지에 표시할 행 계산
  const displayedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // 페이지 변경 핸들러
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // 페이지 당 행 수 변경 핸들러
  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  function handleEdit(lessonId: number) {
    router.push(`/admin/lesson/edit/${lessonId}`)
  }

  function handleDelete(lessonId: number) {
    api.delete(`/admin/lesson/${lessonId}`)
      .then(() => {
        alert("삭제되었습니다.")
        setItems(items.filter(item => item.lessonId !== lessonId));
      })
  }

  useEffect(() => {
    api.get("/admin/lesson")
      .then((response) => {
        setItems(response.data)
      });
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
          {displayedRows.map((row) => (
            <TableRow key={row.lessonId}>
              <TableCell >{row.lessonId}</TableCell>
              <TableCell >{row.lessonGroupId}</TableCell>
              <TableCell >{row.lessonGroupName}</TableCell>
              <TableCell >
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography>{row.script}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <AdminSampleGraph sampleVoicePitchY={row.sampleVoicePitchY}/>
                  </AccordionDetails>
                </Accordion>
              </TableCell>
              <TableCell >{row.lastUpdateDt}</TableCell>
              <TableCell >
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleEdit(row.lessonId||0)}
                >
                  수정
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleDelete(row.lessonId||0)}
                >
                  삭제
                </Button>
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
        labelRowsPerPage="페이지 당 항목 수: "
      />
    </TableContainer>
  );
}
