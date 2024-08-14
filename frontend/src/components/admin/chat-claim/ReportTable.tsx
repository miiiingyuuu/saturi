import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tooltip, TextField, Typography } from '@mui/material';
import SortableTableHead from "@/components/SortableTableHead";
import useTableSort from "@/hooks/useTableSort";
import {parseDate} from "@/utils/utils";

interface UserReport {
  chatClaimId: number;
  gameLogId: number;
  userId: number;
  nickname: string;
  roomId: number;
  // quizId: number;
  chatting: string;
  chattingDt: string;
  claimedDt: string;
  isChecked: boolean;
  checkedDt: string | null;
}

interface ReportTableProps {
  reports: UserReport[];
  onDelete: (chatClaimId: number) => void;
  onBan: (userId: number, chatClaimId: number) => void;
}

type HeadCell = {
  id: keyof UserReport | 'actions';
  label: string;
};

const headCells: HeadCell[] = [
  { id: "chatClaimId", label: "Id" },
  { id: "gameLogId", label: "로그Id" },
  // { id: "userId", label: "유저 Id" },
  { id: "roomId", label: "채팅방 Id" },
  {id: "nickname", label: "유저"},
  // { id: "quizId", label: "문제 Id" },
  { id: "chatting", label: "채팅" },
  { id: "chattingDt", label: "채팅 및 신고일시" },
  // { id: "claimedDt", label: "신고 일시" },
  // { id: "isChecked", label: "확인 상태" },
  { id: "checkedDt", label: "확인 일시" },
  { id: "actions", label: "작업" }
];

const ReportTable: React.FC<ReportTableProps> = ({ reports, onDelete, onBan }) => {
  const { rows, order, orderBy, onRequestSort } = useTableSort<UserReport>(reports, "chatClaimId");

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
          {rows.map((report) => (
            <TableRow key={report.chatClaimId}>
              <TableCell>{report.chatClaimId}</TableCell>
              <TableCell>{report.gameLogId}</TableCell>
              <TableCell>{report.roomId}</TableCell>
              <TableCell>{report.nickname}</TableCell>
              <TableCell>
                <Tooltip title={report.chatting} arrow>
                  <span>{report.chatting.length > 20 ? `${report.chatting.substring(0, 20)}...` : report.chatting}</span>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Typography>
                  {new Date(report.chattingDt).toLocaleString()}
                </Typography>
                <Typography>
                  {new Date(report.claimedDt).toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell>{report.checkedDt ? new Date(report.checkedDt).toLocaleString() : ""}</TableCell>
              <TableCell>
                <Button onClick={() => onDelete(report.chatClaimId)} disabled={report.isChecked}>Delete</Button>
                <Button 
                  onClick={() => onBan(report.userId, report.chatClaimId)} 
                  disabled={report.isChecked}
                >
                  {report.isChecked ? "정지됨" : "정지"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReportTable;