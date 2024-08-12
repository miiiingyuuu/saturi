import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tooltip } from '@mui/material';
import SortableTableHead from "@/components/SortableTableHead";
import useTableSort from "@/hooks/useTableSort";

interface UserReport {
  chatClaimId: number;
  gameLogId: number;
  userId: number;
  roomId: number;
  quizId: number;
  chatting: string;
}

interface ReportTableProps {
  reports: UserReport[];
  userRoles: { [key: number]: string };
  onDelete: (chatClaimId: number) => void;
  onBan: (userId: number, chatClaimId: number) => void;
}

type HeadCell = {
  id: keyof UserReport | 'role' | 'actions';
  label: string;
};

const headCells: HeadCell[] = [
  { id: "chatClaimId", label: "Id" },
  { id: "gameLogId", label: "게임 로그 Id" },
  { id: "userId", label: "유저 Id" },
  { id: "roomId", label: "채팅방 Id" },
  { id: "quizId", label: "문제 Id" },
  { id: "chatting", label: "신고 내용" },
  { id: "role", label: "사용자 상태" },
  { id: "actions", label: "작업" }
];

const ReportTable: React.FC<ReportTableProps> = ({ reports, userRoles, onDelete, onBan }) => {
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
          {rows.map((report) => {
            const userRole = userRoles[report.userId] || 'UNKNOWN';
            const isBanned = userRole === 'BANNED';
            return (
              <TableRow key={report.chatClaimId}>
                <TableCell>{report.chatClaimId}</TableCell>
                <TableCell>{report.gameLogId}</TableCell>
                <TableCell>{report.userId}</TableCell>
                <TableCell>{report.roomId}</TableCell>
                <TableCell>{report.quizId}</TableCell>
                <TableCell>
                  <Tooltip title={report.chatting} arrow>
                    <span>{report.chatting.length > 20 ? `${report.chatting.substring(0, 20)}...` : report.chatting}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>{isBanned ? "정지됨" : "활성"}</TableCell>
                <TableCell>
                  <Button onClick={() => onDelete(report.chatClaimId)} disabled={isBanned}>Delete</Button>
                  <Button 
                    onClick={() => onBan(report.userId, report.chatClaimId)} 
                    disabled={isBanned}
                  >
                    {isBanned ? "정지됨" : "정지"}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReportTable;