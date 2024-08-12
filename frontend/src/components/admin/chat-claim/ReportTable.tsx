import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tooltip } from '@mui/material';

interface UserReport {
  chatClaimId: number;
  gameLogId: number;
  userId: number;
  roomId: number;
  quizId: number;
  chatting: string;
  isBanned: boolean;  // 새로 추가된 필드
}

interface ReportTableProps {
  reports: UserReport[];
  onDelete: (chatClaimId: number) => void;
  onBan: (userId: number, chatClaimId: number) => void;
}

type HeadCell = {
  id: keyof UserReport;
  label: string;
};

const headCells: HeadCell[] = [
  { id: "chatClaimId", label: "Id" },
  { id: "gameLogId", label: "게임 로그 Id" },
  { id: "userId", label: "유저 Id" },
  { id: "roomId", label: "채팅방 Id" },
  { id: "quizId", label: "문제 Id" },
  { id: "actions", label: "" }
];

const ReportTable: React.FC<ReportTableProps> = ({ reports, onDelete, onBan }) => {
  const { rows, order, orderBy, onRequestSort } = useTableSort<UserReport>(reports, "chatClaimId");

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Chat Claim ID</TableCell>
            <TableCell>Game Log ID</TableCell>
            <TableCell>User ID</TableCell>
            <TableCell>Room ID</TableCell>
            <TableCell>Quiz ID</TableCell>
            <TableCell>Chatting</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((report) => (
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
              <TableCell>
                {report.isBanned ? "정지됨" : "활성"}
              </TableCell>
              <TableCell>
                <Button 
                  onClick={() => onDelete(report.chatClaimId)}
                  disabled={report.isBanned}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => onBan(report.userId, report.chatClaimId)}
                  disabled={report.isBanned}
                >
                  {report.isBanned ? "정지됨" : "정지"}
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