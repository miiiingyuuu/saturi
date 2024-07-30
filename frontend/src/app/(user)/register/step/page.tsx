"use client"

import "./styles.css"
import { useState } from "react";
import Link from 'next/link';
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { handleValueChange } from "@/utils/utils";
import { updateUser } from "@/utils/authutils";

const StyledSelectBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '50px',
  textAlign: 'center',
  height: 'auto',
  minHeight: '100%',
  fontSize: '2rem'
}));

const StyledBox = styled(Box)(({theme}) => ({
  width: '100%',
  maxWidth: '600px',
  margin: 'auto',
  padding: '20px',
  boxShadow: 1,
  borderRadius: 2,
  justifyContent: 'center',
}));

export default function Step() {
  const [ step, setStep ] = useState(1)
  const [ gender, setGender ] = useState("")
  const [ ageRange, setAgeRange ] = useState("")
  const [ locationId, setLocationId ] = useState("")

  function handleStep(value: number) {
    setStep(prev => prev+value)
  }


  // 버튼 색
  const NextButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#99DE83',
    '&:hover': {
      backgroundColor: '#7AB367',
    },
  }));

  return (
    <StyledSelectBox>
      {step === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ justifyContent: 'center' }}>성별이 어떻게 되시나요?</Typography>
          <RadioGroup defaultValue="null" value={gender} onChange={(event)=> handleValueChange(event,setGender)}>
            <StyledBox className="box">
              <FormControlLabel value="male" control={<Radio />} label="남자" className="content" />
              <FormControlLabel value="female" control={<Radio />} label="여자" className="content" />
              <FormControlLabel value="null" control={<Radio />} label="알려주고 싶지 않아요..." className="content" />
            </StyledBox>
            <Box className="first-button">
              <NextButton variant="contained" className="button" onClick={() => handleStep(1)}>다음</NextButton>
            </Box>
          </RadioGroup>
        </Box>
      )}
      {step === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>연령대가 어떻게 되시나요?</Typography>
          <RadioGroup defaultValue="null" value={ageRange} onChange={(event) => handleValueChange(event, setAgeRange)}>
            <StyledBox className="box">
              <FormControlLabel value="teen-twen" control={<Radio />} label="10대 ~ 20대" className="content" />
              <FormControlLabel value="thri-four" control={<Radio />} label="30대 ~ 40대" className="content" />
              <FormControlLabel value="fif-six" control={<Radio />} label="50대 ~ 60대" className="content" />
              <FormControlLabel value="over-seven" control={<Radio />} label="70대 이상" className="content" />
              <FormControlLabel value="null" control={<Radio />} label="알려주고 싶지 않아요..." className="content" />
            </StyledBox>
            <Box className="selectbutton">
              <NextButton variant="contained" className="button" onClick={() => handleStep(-1)}>뒤로가기</NextButton>
              <NextButton variant="contained" className="button" onClick={() => handleStep(1)}>다음</NextButton>
            </Box>
          </RadioGroup>
        </Box>
      )}
      {step === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>주로 사용하시는 사투리는 무엇인가요?</Typography>
          <RadioGroup defaultValue="null" value={locationId} onChange={(event) => handleValueChange(event, setLocationId)}>
            <StyledBox className="box">
              <FormControlLabel value="gyeonggi" control={<Radio />} label="경기도" className="content" />
              <FormControlLabel value="gyeongsang" control={<Radio />} label="경상도" className="content" />
              <FormControlLabel value="jeolla" control={<Radio />} label="전라도" className="content" />
              <FormControlLabel value="chungchung" control={<Radio />} label="충청도" className="content" />
              <FormControlLabel value="kangwon" control={<Radio />} label="강원도" className="content" />
              <FormControlLabel value="jeju" control={<Radio />} label="제주도" className="content" />
              <FormControlLabel value="null" control={<Radio />} label="알려주고 싶지 않아요..." className="content" />
            </StyledBox>
            <Box className="selectbutton">
              <NextButton variant="contained" className="button" onClick={() => handleStep(-1)}>뒤로가기</NextButton>
              <NextButton variant="contained" className="button" onClick={() => {
                updateUser({
                  gender,
                  locationId,
                  ageRange
                })
                handleStep(1)
              }}>회원가입 완료</NextButton>
            </Box>
          </RadioGroup>
        </Box>
      )}
      {step === 4 && (
        <Box>
          <Typography variant="h4" gutterBottom>회원가입이 완료되었습니다!</Typography>
            <Link href="/login" passHref>
              <NextButton variant="contained" sx={{ width:'200px', height:'50px', padding: 'auto' }}>로그인 페이지로</NextButton>
            </Link>
        </Box>
      )} 
    </StyledSelectBox>
  )
}