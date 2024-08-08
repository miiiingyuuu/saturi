"use client"

import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Alert, Step, StepLabel, Stepper, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

const CombinedResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const steps = ['이메일 입력', '인증 코드 확인'];

  // 이메일 인증
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/user/auth/email-valid', { email });
      setMessage(`인증 코드가 이메일로 전송되었습니다.\n네트워크 상황에 따라 메일 수신까지 시간이 걸릴 수 있습니다.`);
      setActiveStep(1);
    } catch (error) {
      setMessage('이메일 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일 인증 성공 -> 임시 비밀번호 설정
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/user/auth/password-find', { email, code });
      const { tempPassword } = response.data;
      alert("인증이 완료되었습니다!");
      router.push(`/findpassword/tmppassword?tempPassword=${encodeURIComponent(tempPassword)}`);
    } catch (error: any) {
      if (error.response) {
        setMessage(error.response.data.message || '인증에 실패했습니다. 다시 시도.');
      } else {
        setMessage('인증에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center" sx={{ mt:3, mb:4 }}>
        비밀번호 재설정
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 ? (
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
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              '인증 코드 전송'
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode}>
          <TextField
            fullWidth
            label="이메일"
            variant="outlined"
            value={email}
            disabled
            margin="normal"
          />
          <TextField
            fullWidth
            label="인증 코드"
            variant="outlined"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            margin="normal"
            required
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            확인
          </Button>
        </form>
      )}
      {message && (
        <Alert severity={activeStep === 1 ? "info" : "error"} sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default CombinedResetPasswordPage;