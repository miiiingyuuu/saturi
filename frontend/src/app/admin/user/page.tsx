"use client"

import {
  Table,
  TableBody,
  TableContainer,
  Paper,
  Typography,
  TableRow,
  TableCell,
  TablePagination,
  Container, TextField, Button, Box, Tooltip,
} from "@mui/material";
import api from "@/lib/axios";
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react";
import useTableSort from "@/hooks/useTableSort";
import SortableTableHead from "@/components/admin/admin-form/SortableTableHead";
import { handleValueChange } from "@/utils/utils";

interface UserProps {
  userId: number
  locationId: number
  email: string
  nickname: string
  regDate: string
  exp: number
  gender: string
  role: string
  returnDt: string | null
}

type HeadCell = {
  id: keyof UserProps | "actions";
  label: string;
};

const headCells: HeadCell[] = [
  { id: "email", label: "이메일" },
  { id: "nickname", label: "별명" },
  { id: "gender", label: "성별" },
  { id: "regDate", label: "가입일" },
  { id: "exp", label: "경험치" },
  { id: "role", label: "권한" },
];

export default function App() {
  const router = useRouter()
  const [ items, setItems] = useState<UserProps[]>([]);
  const { rows, order, orderBy, onRequestSort } = useTableSort<UserProps>(items, "lessonId");
  // Pagination 관련 상태
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchNickname, setSearchNickname] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
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

  useEffect(() => {
    api.get("/admin/user")
      .then((response) => {
        setItems(response.data)
      });
  }, []);

  function findUser() {
    api.get("/admin/user")
      .then((response) => {
        setItems(response.data)
        if (searchNickname) {
          setItems(prev => prev.filter((user: UserProps) => user.nickname.includes(searchNickname)))
        }
        if (searchEmail) {
          setItems(prev => prev.filter((user: UserProps) => user.email.includes(searchEmail)))
        }
      })
  }

  return (
    <Container>
      <Typography component="h1" variant="h4" sx={{display: 'flex', justifyContent: "center", mb:3,}}>
        유저 조회
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: "center", justifyContent: "right" }}>
        <TextField
          name="searchNickname"
          label="닉네임 검색"
          value={searchNickname}
          onChange={(event) => handleValueChange(event, setSearchNickname)}
        />
        <TextField
          name="searchEmail"
          label="이메일 검색"
          value={searchEmail}
          onChange={(event) => handleValueChange(event, setSearchEmail)}
        />
        <Button variant="contained" onClick={findUser}>검색</Button>
      </Box>
      <Typography sx={{display: 'flex', justifyContent: "right", color: "gray"}}>
        BANNED에 마우스를 올리면 정지 기간을 확인하실 수 있습니다.
      </Typography>
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
              <TableRow key={row.userId}>
                <TableCell
                  sx={{ width: "20%" }}
                >
                  {row.email}
                </TableCell>
                <TableCell
                  sx={{ width: "15%" }}
                >
                  {row.nickname}
                </TableCell>
                <TableCell
                  sx={{ width: "15%" }}
                >
                  {row.gender}
                </TableCell>
                <TableCell
                  sx={{ width: "20%" }}
                >{new Date(row.regDate).toLocaleDateString()}
                </TableCell>
                <TableCell
                  sx={{ width: "15%" }}
                >
                  {row.exp}
                </TableCell>

                <TableCell
                  sx={{ width: "15%" }}
                >
                  <Tooltip
                    title={row.role === "BANNED" && `${new Date(row.returnDt || "").toLocaleString()} 까지`}
                    disableFocusListener
                    disableTouchListener
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: 'offset',
                            options: {
                              offset: [0, -20],
                            },
                          },
                        ],
                      },
                    }}
                  >
                    <Typography>
                      {row.role}
                    </Typography>
                  </Tooltip>
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
    </Container>
  );
}
