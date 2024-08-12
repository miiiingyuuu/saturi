import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import SortableTableHead from "@/components/SortableTableHead";
import useTableSort from "@/hooks/useTableSort";

interface UserReport {
  chatClaimId: number;
  gameLogId: number;
  userId: number;
  roomId: number;
  quizId: number;
  actions: string
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