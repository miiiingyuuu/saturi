"use client"

import React, { useState } from 'react';
import "./styles.css"
import Link from 'next/link';
import { 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Button, 
  Typography, 
  Box 
} from '@mui/material';

export default function Step() {
  const [step, setStep] = useState(1)

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  return (
    <Box className="select">
      {step === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>성별이 어떻게 되시나요?</Typography>
          <RadioGroup defaultValue="null">
            <Box className="box">
              <FormControlLabel value="male" control={<Radio />} label="남자" className="content" />
              <FormControlLabel value="female" control={<Radio />} label="여자" className="content" />
              <FormControlLabel value="null" control={<Radio />} label="알려주고 싶지 않아요..." className="content" />
            </Box>
            <Box className="first-button">
            <Button 
              variant="contained" 
              sx={{
                background: '#99DE83',
                width: 'auto',
                height: '40px',
                '&:hover': {
                  backgroundColor: '#7AB367',
                },
              }}
              onClick={handleNext}
            >
              다음
            </Button>
            </Box>
          </RadioGroup>
        </Box>
      )}
      {step === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>연령대가 어떻게 되시나요?</Typography>
          <RadioGroup defaultValue="null">
            <Box className="box">
              <FormControlLabel value="teen-twen" control={<Radio />} label="10대 ~ 20대" className="content" />
              <FormControlLabel value="thri-four" control={<Radio />} label="30대 ~ 40대" className="content" />
              <FormControlLabel value="fif-six" control={<Radio />} label="50대 ~ 60대" className="content" />
              <FormControlLabel value="over-seven" control={<Radio />} label="70대 이상" className="content" />
              <FormControlLabel value="null" control={<Radio />} label="알려주고 싶지 않아요..." className="content" />
            </Box>
            <Box className="selectbutton">
            <Button 
              variant="contained" 
              sx={{
                background: '#99DE83',
                width: 'auto',
                height: '40px',
                '&:hover': {
                  backgroundColor: '#7AB367',
                },
              }}
              onClick={handleBack}
            >
              뒤로가기
            </Button>
            <Button 
              variant="contained" 
              sx={{
                background: '#99DE83',
                width: 'auto',
                height: '40px',
                '&:hover': {
                  backgroundColor: '#7AB367',
                },
              }}
              onClick={handleNext}
            >
              다음
            </Button>
            </Box>
          </RadioGroup>
        </Box>
      )}
      {step === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>주로 사용하시는 사투리는 무엇인가요?</Typography>
          <RadioGroup defaultValue="null">
            <Box className="box">
              <FormControlLabel value="gyeonggi" control={<Radio />} label="경기도" className="content" />
              <FormControlLabel value="gyeongsang" control={<Radio />} label="경상도" className="content" />
              <FormControlLabel value="jeolla" control={<Radio />} label="전라도" className="content" />
              <FormControlLabel value="chungchung" control={<Radio />} label="충청도" className="content" />
              <FormControlLabel value="kangwon" control={<Radio />} label="강원도" className="content" />
              <FormControlLabel value="jeju" control={<Radio />} label="제주도" className="content" />
              <FormControlLabel value="null" control={<Radio />} label="알려주고 싶지 않아요..." className="content" />
            </Box>
            <Box className="selectbutton">
            <Button 
              variant="contained" 
              sx={{
                background: '#99DE83',
                width: 'auto',
                height: '40px',
                '&:hover': {
                  backgroundColor: '#7AB367',
                },
              }}
              onClick={handleBack}
            >
              뒤로가기
            </Button>
            <Button 
              variant="contained" 
              sx={{
                background: '#99DE83',
                width: 'auto',
                height: '40px',
                '&:hover': {
                  backgroundColor: '#7AB367',
                },
              }}
              onClick={handleNext}
            >
              회원가입 완료
            </Button>
            </Box>
          </RadioGroup>
        </Box>
      )}
      {step === 4 && (
        <Box>
          <Typography variant="h4" gutterBottom>회원가입이 완료되었습니다!</Typography>
          <Box className="final">
            <Link href="/login" passHref>
            <Button 
            variant="contained" 
            sx={{
              background: '#99DE83',
              width: '400px',
              height: '50px',
              marginTop: '30px',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#7AB367',
              },
            }}
            >
              회원 가입 완료
          </Button>
            </Link>
          </Box>
        </Box>
      )}
    </Box>
  )
}