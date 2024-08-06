"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Alert,
  Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { changePassword } from './confirmation';
import { validatePassword } from '@/utils/utils';

const PasswordChangeForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(false);

    if (!validatePassword(currentPassword) || !validatePassword(newPassword)) {
      setMessage('비밀번호는 숫자, 소문자, 특수문자를 포함한 8자 이상이어야 합니다.');
      setIsError(true);
      return;
    }

    const result = await changePassword({ currentPassword, newPassword });
    setMessage(result.message);
    setIsError(!result.success);
    if (result.success) {
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => {
        router.push('/user/profile');
      }, 2000);
    }
  };

  const handleGoBack = () => {
    router.push('/user/profile/update');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          비밀번호 변경
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="currentPassword"
            label="현재 비밀번호"
            type="password"
            id="currentPassword"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="새 비밀번호"
            type="password"
            id="newPassword"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={6}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
                variant="outlined"
                fullWidth
              >
                뒤로 가기
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
              >
                비밀번호 변경
              </Button>
            </Grid>
          </Grid>
        </Box>
        {message && (
          <Alert severity={isError ? "error" : "success"} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default PasswordChangeForm;