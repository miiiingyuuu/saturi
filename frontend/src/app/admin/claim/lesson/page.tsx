"use client"

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import api from '@/lib/axios';
import SortableTableHead from "@/components/SortableTableHead";
import useTableSort from "@/hooks/useTableSort";
import {parseDate} from "@/utils/utils";


interface LessonClaim {
  lessonClaimId: number;
  lessonId: number;
  userName: string;
  // userId: number;
  content: string;
  claimDt: string;
}

type HeadCell = {
  id: keyof LessonClaim;
  label: string;
};

const headCells: HeadCell[] = [
  { id: "lessonClaimId", label: "신고 Id" },
  { id: "lessonId", label: "레슨 Id" },
  { id: "userName", label: "유저"},
  // { id: "userId", label: "유저 Id" },
  { id: "content", label: "신고 내용" },
  { id: "claimDt", label: "신고 일자" },
];

const useLessonClaims = () => {
  const [claims, setClaims] = useState<LessonClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await api.get<LessonClaim[]>('/admin/lesson/claim');
        setClaims(response.data);
      } catch (err) {
        setError('Failed to fetch lesson claims');
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  return { claims, loading, error };
};

const LessonClaimsTable: React.FC<{ claims: LessonClaim[] }> = ({ claims }) => {
  const { rows, order, orderBy, onRequestSort } = useTableSort<LessonClaim>(claims, "lessonClaimId");

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

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="lesson claims table">
        <SortableTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={onRequestSort}
          headCells={headCells}
        />
        <TableBody>
          {displayedRows.map((claim) => (
            <TableRow
              key={claim.lessonClaimId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {claim.lessonClaimId}
              </TableCell>
              <TableCell>{claim.lessonId}</TableCell>
              <TableCell>{claim.userName}</TableCell>
              {/*<TableCell>{claim.userId}</TableCell>*/}
              <TableCell>{claim.content}</TableCell>
              <TableCell>{parseDate(claim.claimDt)}</TableCell>
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
};

const LessonClaimsPage: React.FC = () => {
  const { claims, loading, error } = useLessonClaims();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box m={2}>
      <Typography variant="h4" component="h1" gutterBottom>
        레슨 신고 내용
      </Typography>
      <LessonClaimsTable claims={claims} />
    </Box>
  );
};

export default LessonClaimsPage;