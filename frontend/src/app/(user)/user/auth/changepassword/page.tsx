"use client"

import api from "@/lib/axios";
import { useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PasswordValidation from "@/components/profile/PasswordValidation";
import { handleValueChange, validatePassword } from "@/utils/utils";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Grid
} from '@mui/material';
import CustomButton from "@/components/ButtonColor";

export default function App() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const isNewPasswordValid = useMemo(() => validatePassword(newPassword), [newPassword]);

  function changePassword() {
    api.put("user/auth/password-update", {
      currentPassword,
      newPassword
    })
      .then(() => {
        alert("비밀번호가 변경되었습니다.")
        router.push("/user/profile")
      })
    }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          비밀번호 변경
        </Typography>
        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault()
            changePassword()
          }}
          noValidate
          sx={{ mt: 1 }}
        >
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
            onChange={(event) => handleValueChange(event, setCurrentPassword)}
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
            onChange={(event) => handleValueChange(event, setNewPassword)}
            error={!isNewPasswordValid}
          />
          <PasswordValidation password={newPassword} />
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={6}>
              <CustomButton
                startIcon={<ArrowBackIcon />}
                onClick={() => {
                  router.push('/user/profile/update');
                }}
                variant="outlined"
                fullWidth
              >
                뒤로 가기
              </CustomButton>
            </Grid>
            <Grid item xs={6}>
              <CustomButton
                type="submit"
                variant="contained"
                fullWidth
                disabled={!isNewPasswordValid || newPassword === ''}
              >
                비밀번호 변경
              </CustomButton>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};