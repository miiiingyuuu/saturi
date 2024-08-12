import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

interface UserReport {
  chatClaimId: number;
  gameLogId: number;
  userId: number;
  roomId: number;
  quizId: number;
}

interface ReportTableProps {
  reports: UserReport[];
  onDelete: (chatClaimId: number) => void;
  onBan: (userId: number, chatClaimId: number) => void;
}

const ReportTable: React.FC<ReportTableProps> = ({ reports, onDelete, onBan }) => {
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
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.chatClaimId}>
              <TableCell>{report.chatClaimId}</TableCell>
              <TableCell>{report.gameLogId}</TableCell>
              <TableCell>{report.userId}</TableCell>
              <TableCell>{report.roomId}</TableCell>
              <TableCell>{report.quizId}</TableCell>
              <TableCell>
                <Button onClick={() => onDelete(report.chatClaimId)}>Delete</Button>
                <Button onClick={() => onBan(report.userId, report.chatClaimId)}>Ban</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReportTable;