"use client";

import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
  Autocomplete,
  TextField,
  Container,
} from "@mui/material";
import api from "@/lib/axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useConfirmLeave from "@/hooks/useConfirmLeave";

interface Option {
  label: string;
  id: number;
}

const genderOptions: Option[] = [
  { label: "알려주고 싶지 않아요", id: 0 },
  { label: "남자", id: 1 },
  { label: "여자", id: 2 },
];

const locationOptions: Option[] = [
  { label: "알려주고 싶지 않아요", id: 1 },
  { label: "경상도", id: 2 },
  { label: "경기도", id: 3 },
  { label: "강원도", id: 4 },
  { label: "충청도", id: 5 },
  { label: "전라도", id: 6 },
  { label: "제주도", id: 7 },
];

const ageRangeOptions: Option[] = [
  { label: "알려주고 싶지 않아요", id: 0 },
  { label: "10대 이하", id: 1 },
  { label: "10대", id: 2 },
  { label: "20대", id: 3 },
  { label: "30대", id: 4 },
  { label: "40대", id: 5 },
  { label: "50대", id: 6 },
  { label: "60대", id: 7 },
  { label: "70대", id: 8 },
  { label: "80대", id: 9 },
  { label: "90대", id: 10 },
];

const steps = [
  { label: '당신의 성별은 무엇입니까?' },
  { label: '당신이 거주하고 있는 지역은 어디입니까?' },
  { label: '당신의 연령대를 선택해주세요.' },
];

export default function App() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [gender, setGender] = useState<Option | null>(null);
  const [location, setLocation] = useState<Option | null>(null);
  const [ageRange, setAgeRange] = useState<Option | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };



  // 어케함 여기?? 물어보기
  // handleNext 에 axios 걸어서 하나씩 보내기
  function handleUpdateUser() {
    const genderId = gender?.id ?? null;
    const locationId = location?.id ?? null;
    const ageRangeId = ageRange?.id ?? null;
    const nickname = getCookie("nickname");
    api.put("/user/auth", {
      gender: genderId,
      locationId,
      ageRange: ageRangeId,
      nickname,
      isChanged: 0,
      birdId: 1,
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !(getCookie("gender") === "DEFAULT" || getCookie("location") === "default" || getCookie("ageRange") === "DEFAULT")) {
      router.push("/");
    }

    // Update window size for Confetti
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateWindowSize(); // Initialize with current window size
    window.addEventListener("resize", updateWindowSize);

    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, []);

  useConfirmLeave();

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: '100%',
          maxWidth: 'md',
        }}
      >
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          sx={{
            width: '100%',
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
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                {index === 0 && (
                  <Autocomplete
                    disablePortal
                    options={genderOptions}
                    getOptionLabel={(option) => option.label}
                    value={gender}
                    onChange={(event, newValue: Option | null) => setGender(newValue)}
                    renderInput={(params) => <TextField {...params} label="Gender" fullWidth />}
                    sx={{ mb: 2 }}
                  />
                )}
                {index === 1 && (
                  <Autocomplete
                    disablePortal
                    options={locationOptions}
                    getOptionLabel={(option) => option.label}
                    value={location}
                    onChange={(event, newValue: Option | null) => setLocation(newValue)}
                    renderInput={(params) => <TextField {...params} label="Location" fullWidth />}
                    sx={{ mb: 2 }}
                  />
                )}
                {index === 2 && (
                  <Autocomplete
                    disablePortal
                    options={ageRangeOptions}
                    getOptionLabel={(option) => option.label}
                    value={ageRange}
                    onChange={(event, newValue: Option | null) => setAgeRange(newValue)}
                    renderInput={(params) => <TextField {...params} label="Age Range" fullWidth />}
                    sx={{ mb: 2 }}
                  />
                )}
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <CustomButton
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Next'}
                  </CustomButton>
                  <CustomButton
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, ml: 1 }}
                  >
                    Back
                  </CustomButton>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3, width: '100%', backgroundColor: 'transparent' }}>
            <Typography>
              모든 준비가 완료되었습니다!
            </Typography>
            <Button
              onClick={() => {
                handleUpdateUser()
                router.push("/");
              }}
              sx={{ mt: 1, mr: 1 }}
            >
              메인으로
            </Button>
          </Paper>
        )}
      </Box>
    </Container>
  );
}
