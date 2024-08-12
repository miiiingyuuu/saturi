import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tooltip, CircularProgress } from '@mui/material';
import SortableTableHead from "@/components/SortableTableHead";
import useTableSort from "@/hooks/useTableSort";
import api from '@/lib/axios';

interface UserReport {
  chatClaimId: number;
  gameLogId: number;
  email: string;
  roomId: number;
  quizId: number;
  chatting: string;
}

interface UserProfile {
  email: string;
  role: 'BANNED' | 'BASIC' | string;
}

interface ReportTableProps {
  reports: UserReport[];
  onDelete: (chatClaimId: number) => void;
  onBan: (email: string, chatClaimId: number) => void;
}

type HeadCell = {
  id: keyof UserReport | 'role' | 'actions';
  label: string;
};

const headCells: HeadCell[] = [
  { id: "chatClaimId", label: "Id" },
  { id: "gameLogId", label: "게임 로그 Id" },
  { id: "email", label: "사용자 이메일" },
  { id: "roomId", label: "채팅방 Id" },
  { id: "quizId", label: "문제 Id" },
  { id: "chatting", label: "신고 내용" },
  { id: "role", label: "사용자 상태" },
  { id: "actions", label: "작업" }
];

const ReportTable: React.FC<ReportTableProps> = ({ reports, onDelete, onBan }) => {
  const [userRoles, setUserRoles] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const { rows, order, orderBy, onRequestSort } = useTableSort<UserReport>(reports, "chatClaimId");

  useEffect(() => {
    const fetchUserRoles = async () => {
      setLoading(true);
      try {
        // ES5 호환 방식으로 중복 이메일 제거
        const emails = reports.reduce<string[]>((acc, report) => {
          if (!acc.includes(report.email)) {
            acc.push(report.email);
          }
          return acc;
        }, []);

        const rolePromises = emails.map(email =>
          api.get<UserProfile>(`/user/auth/profile`, { params: { email } })
        );
        const roleResponses = await Promise.all(rolePromises);
        const newUserRoles = roleResponses.reduce((acc, response) => {
          acc[response.data.email] = response.data.role;
          return acc;
        }, {} as { [key: string]: string });
        setUserRoles(newUserRoles);
      } catch (error) {
        console.error('Failed to fetch user roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, [reports]);

  if (loading) {
    return <CircularProgress />;
  }

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
            const userRole = userRoles[report.email] || 'UNKNOWN';
            const isBanned = userRole === 'BANNED';
            return (
              <TableRow key={report.chatClaimId}>
                <TableCell>{report.chatClaimId}</TableCell>
                <TableCell>{report.gameLogId}</TableCell>
                <TableCell>{report.email}</TableCell>
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
                    onClick={() => onBan(report.email, report.chatClaimId)} 
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