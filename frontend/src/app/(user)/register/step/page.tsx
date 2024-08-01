"use client";

import { useState } from "react";
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
import { updateUser } from "@/utils/authutils";

// Sample data for Autocomplete options
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
  { label: "10대 이하", id: 0 },
  { label: "10대", id: 1 },
  { label: "20대", id: 2 },
  { label: "30대", id: 3 },
  { label: "40대", id: 4 },
  { label: "50대", id: 5 },
  { label: "60대", id: 6 },
  { label: "70대", id: 7 },
  { label: "80대", id: 8 },
  { label: "90대", id: 9 },
];

const steps = [
  { label: 'Select Gender' },
  { label: 'Select Location' },
  { label: 'Select Age Range' },
];

export default function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [gender, setGender] = useState<Option | null>(null);
  const [location, setLocation] = useState<Option | null>(null);
  const [ageRange, setAgeRange] = useState<Option | null>(null);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleUpdateUser = () => {
    const genderId = gender?.id ?? null;
    const locationId = location?.id ?? null;
    const ageRangeId = ageRange?.id ?? null;
    // TODO: 여기서 안들어온 값 함수 단에서 처리하기
    updateUser({ gender: genderId, location: locationId, ageRange: ageRangeId });
  };

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
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ width: '100%' }}>
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
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, ml: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3, width: '100%' }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button
              onClick={handleUpdateUser}
              sx={{ mt: 1, mr: 1 }}
            >
              Update
            </Button>
          </Paper>
        )}
      </Box>
    </Container>
  );
}
