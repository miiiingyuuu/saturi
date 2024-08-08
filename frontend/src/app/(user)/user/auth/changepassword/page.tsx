"use client"

import React, { useState, useEffect } from 'react';
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
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsNewPasswordValid(validatePassword(newPassword) || newPassword === '');
  }, [newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(false);

    if (!validatePassword(newPassword)) {
      setMessage('새 비밀번호가 요구사항을 충족하지 않습니다.');
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
      }, 300);
    }
  };

  const handleGoBack = () => {
    router.push('/user/profile/update');
  };

  return (
    <Container maxWidth="md">
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
            error={!isNewPasswordValid && newPassword !== ''}
            helperText={!isNewPasswordValid && newPassword !== '' ? "비밀번호 요구사항을 충족하지 않습니다." : ""}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: isNewPasswordValid || newPassword === '' ? 'rgba(0, 0, 0, 0.23)' : 'red',
                },
                '&:hover fieldset': {
                  borderColor: isNewPasswordValid || newPassword === '' ? 'rgba(0, 0, 0, 0.23)' : 'red',
                },
                '&.Mui-focused fieldset': {
                  borderColor: isNewPasswordValid || newPassword === '' ? '#1976d2' : 'red',
                },
              },
            }}
          />
          <Typography sx={{ fontSize: '12px', ml: 1, color: 'text.secondary' }}>
            새 비밀번호는 숫자, 소문자, 특수문자를 포함한 8자 이상
          </Typography>
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
                disabled={!isNewPasswordValid || newPassword === ''}
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