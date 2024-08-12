"use client"

import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import api from '@/lib/axios';
import SearchFilters from '@/components/admin/chat-claim/SearchFilters';
import ReportTable from '@/components/admin/chat-claim/ReportTable';
import BanDialog from '@/components/admin/chat-claim/Ban';

interface UserReport {
  chatClaimId: number;
  gameLogId: number;
  userId: number;
  roomId: number;
  quizId: number;
}

const UserReportManagementPage: React.FC = () => {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    gameLogId: '',
    userId: '',
    roomId: '',
    quizId: ''
  });
  const [openBanDialog, setOpenBanDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedChatClaimId, setSelectedChatClaimId] = useState<number | null>(null);
  const [banDuration, setBanDuration] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // 신고 유저 조회
  const fetchReports = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([_, value]) => value !== '')
      ).toString();
      const response = await api.get<UserReport[]>(`/admin/claim/user?${queryParams}`);
      setReports(response.data);
    } catch (err) {
      setError('Failed to fetch user reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const handleSearch = () => {
    fetchReports();
  };

  // 채팅 신고 삭제
  const handleDelete = async (chatClaimId: number) => {
    try {
      await api.delete(`/admin/claim/user`, { data: { chatClaimId } });
      setSnackbar({ open: true, message: '신고가 삭제되었습니다.', severity: 'success' });
      fetchReports();
    } catch (err) {
      setSnackbar({ open: true, message: '신고 삭제에 실패했습니다.', severity: 'error' });
    }
  };

  // 유저 정지
  const handleBanClick = (userId: number, chatClaimId: number) => {
    setSelectedUserId(userId);
    setSelectedChatClaimId(chatClaimId);
    setOpenBanDialog(true);
  };

  // 유저 정지
  const handleBanConfirm = async () => {
    if (selectedUserId && selectedChatClaimId) {
      try {
        await api.post('/admin/claim/user', {
          userId: selectedUserId,
          banDate: parseInt(banDuration),
          chatClaimId: selectedChatClaimId
        });
        setSnackbar({ open: true, message: '사용자가 정지되었습니다.', severity: 'success' });
        fetchReports();
      } catch (err) {
        setSnackbar({ open: true, message: '사용자 정지에 실패했습니다.', severity: 'error' });
      }
    }
    setOpenBanDialog(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ m: 2 }}>
      <Typography variant="h4" gutterBottom>유저 신고 관리</Typography>
      <SearchFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />
      <ReportTable 
        reports={reports}
        onDelete={handleDelete}
        onBan={handleBanClick}
      />
      <BanDialog 
        open={openBanDialog}
        onClose={() => setOpenBanDialog(false)}
        onConfirm={handleBanConfirm}
        banDuration={banDuration}
        onBanDurationChange={(e) => setBanDuration(e.target.value)}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserReportManagementPage;