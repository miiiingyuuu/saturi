"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Button, 
  TextField, 
  Typography, 
  Box, 
  Alert, 
  Step, 
  StepLabel, 
  Stepper, 
  CircularProgress,
  Paper,
  Snackbar
} from '@mui/material';
import api from '@/lib/axios';

const FindPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const router = useRouter();

  const steps = ['이메일 입력', '인증 코드 확인', '임시 비밀번호 발급'];

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/user/auth/password-find/email-valid', { email });
      setMessage('인증 코드가 이메일로 전송되었습니다.');
      setActiveStep(1);
    } catch (error: any) {
      console.error('Error details:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        if (error.response.status === 400) {
          setMessage('이메일 계정이 존재하지 않습니다.');
        } else {
          setMessage(error.response.data.message || '이메일 전송에 실패했습니다. 다시 시도해주세요.');
        }
      } else if (error.request) {
        setMessage('서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요.');
      } else {
        setMessage('오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log(email, code)
      const response = await api.post('/user/auth/password-find', { email, code });
      const { tempPassword: newTempPassword } = response.data;
      setTempPassword(newTempPassword);
      setActiveStep(2);
    } catch (error: any) {
      console.error('Error details:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        if (error.response.status === 400) {
          setMessage('인증코드가 일치하지 않습니다.');
        } else {
          setMessage(error.response.data.message || '이메일 전송에 실패했습니다. 다시 시도해주세요.');
        }
      } else if (error.request) {
        setMessage('서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요.');
      } else {
        setMessage('오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(tempPassword)
      .then(() => {
        setMessage('비밀번호가 클립보드에 복사되었습니다.');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch(() => {
        setMessage('비밀번호 복사에 실패했습니다. 수동으로 복사해주세요.');
      });
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center" sx={{ mb: 3 }}>
        비밀번호 찾기
      </Typography>
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel 
        sx={{
          mb: 4,
          '& .MuiStepIcon-root': {
            color: '#e0e0e0', // 비활성 아이콘 색상
            '&.Mui-active': {
              color: '#0097a7', // 활성 아이콘 색상
            },
            '&.Mui-completed': {
              color: '#00838f', // 완료된 아이콘 색상
            },
          },
          '& .MuiStepConnector-line': {
            borderColor: '#bdbdbd', // 연결선 색상
          },
        }}
        >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 && (
        <form onSubmit={handleSendCode}>
          <TextField
            fullWidth
            label="이메일"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            type="email"
          />
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            sx={{ mt: 3 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : '인증 코드 전송'}
          </Button>
        </form>
      )}
      {activeStep === 1 && (
        <form onSubmit={handleVerifyCode}>
          <TextField
            fullWidth
            label="인증 코드"
            variant="outlined"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            margin="normal"
            required
          />
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            sx={{ mt: 3 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : '확인'}
          </Button>
        </form>
      )}
      {activeStep === 2 && (
        <Paper elevation={4} sx={{ width: '100%', p: 3, mt: 2 }}>
          <Typography variant="h5" gutterBottom>
            임시 비밀번호
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
            {`아래의 임시 비밀번호를 사용하여 로그인하세요.\n로그인 후 즉시 비밀번호를 변경하는 것을 권장합니다.`}
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
      )}
      <Snackbar 
        open={!!message} 
        autoHideDuration={3000} 
        onClose={() => setMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setMessage('')} severity="info" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FindPasswordPage;