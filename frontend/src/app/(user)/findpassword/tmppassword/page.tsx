"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Button, Container, Paper, TextField, Alert, Snackbar } from '@mui/material';

const TempPasswordPage: React.FC = () => {
  const [tempPassword, setTempPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) {
      router.push('/error');
      return;
    }

    const password = searchParams.get('tempPassword');
    if (password) {
      setTempPassword(decodeURIComponent(password));
    } else {
      router.push('/error');
    }
  }, [searchParams, router]);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(tempPassword)
      .then(() => {
        setMessage('비밀번호가 복사되었습니다.');
        setTimeout(() => setMessage(''), 3000); // 3초 후 메시지 제거
      })
      .catch(() => {
        setMessage('비밀번호 복사에 실패했습니다. 수동으로 복사해주세요.');
      });
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  if (!tempPassword) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          임시 비밀번호
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          아래의 임시 비밀번호를 사용하여 로그인하세요. 로그인 후 즉시 비밀번호를 변경하는 것을 권장합니다.
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={tempPassword}
          InputProps={{
            readOnly: true,
          }}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="outlined" onClick={handleCopyPassword}>
            비밀번호 복사
          </Button>
          <Button variant="contained" onClick={handleGoToLogin}>
            로그인 화면으로 이동
          </Button>
        </Box>
      </Paper>
      <Snackbar 
        open={!!message} 
        autoHideDuration={3000} 
        onClose={() => setMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setMessage('')} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TempPasswordPage;