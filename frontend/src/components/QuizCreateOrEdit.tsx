"use client";

import {
  Box,
  Grid,
  TextField,
  Button,
  Autocomplete,
  Container,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { handleValueChange } from "@/utils/utils";
import { ILocationProps } from "@/utils/props";
import { getLocation } from "@/utils/adminutils";
import { useRouter } from "next/navigation"

interface QuizProps {
  quizId?: number; // 수정의 경우 quizId가 필요
  locationId: number;
  question: string;
  isObjective: boolean;
  choiceList: { choiceId: number; content: string; isAnswer: boolean }[];
}

// quizId 가 있으며 수정, 없으면 생성
// eslint-disable-next-line react/require-default-props
export default function QuizForm({quizId} : {quizId? : number}) {
  const router = useRouter()
  const [question, setQuestion] = useState("");
  const [isObjective, setIsObjective] = useState(true);
  const [locationId, setLocationId] = useState<ILocationProps | null>(null);
  const [locationOptions, setLocationOptions] = useState<ILocationProps[]>([]);
  const [choices, setChoices] = useState([
    { choiceId: 1, content: "", isAnswer: false },
    { choiceId: 2, content: "", isAnswer: false },
    { choiceId: 3, content: "", isAnswer: false },
    { choiceId: 4, content: "", isAnswer: false },
  ]);

  // 선택지 변경 핸들러
  function handleChoiceChange(index: number, value: string) {
    const newChoices = [...choices];
    newChoices[index].content = value;
    setChoices(newChoices);
  };

  // 정답 여부 변경 핸들러
  function handleAnswerChange(index: number) {
    const newChoices = choices.map((choice, i) => ({
      ...choice,
      isAnswer: i === index ? !choice.isAnswer : choice.isAnswer,
    }));
    setChoices(newChoices);
  };

  // 생성 또는 수정 요청 처리 함수
  function handleSubmit() {
    const quizData: QuizProps = {
      locationId: locationId?.locationId || 0,
      question,
      isObjective,
      choiceList: isObjective
        ? choices
        : [
            {
              choiceId: 1,
              content: choices[0].content,
              isAnswer: true,
            },
          ],
    };

    if (quizId) {
      // 수정 모드
      api.put(`/admin/game/quiz/${quizId}`, quizData)
        .then(() => {
          alert("수정되었습니다.");
          router.push("/admin/quiz/view")
        })
        .catch((err) => console.log(err));
    } else {
      // 생성 모드
      api.post("/admin/game/quiz", quizData)
        .then(() => {
          alert("등록되었습니다.");
          router.push("/admin/quiz/view")
        })
        .catch((err) => console.log(err));
    }
  };

  // 데이터 비동기 처리 (지역 데이터 로딩)
  useEffect(() => {
    async function fetchData() {
      const location = await getLocation();
      setLocationOptions(location);
    }
    fetchData();
  }, []);

  // 퀴즈 데이터 로딩 (수정 모드인 경우)
  useEffect(() => {
    if (quizId) {
      api.get<QuizProps>(`/admin/game/quiz/${quizId}`)
        .then((response) => {
          const { locationId, question, isObjective, choiceList } = response.data;
          setLocationId(locationOptions.find(loc => loc.locationId === locationId) || null);
          setQuestion(question);
          setIsObjective(isObjective);
          setChoices(choiceList);
        })
        .catch((error) => console.error(error));
    }
  }, [quizId, locationOptions]);

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {quizId ? "퀴즈 수정" : "퀴즈 등록"}
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
          sx={{ mt: 3 }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={isObjective}
                onChange={() => setIsObjective((prev) => !prev)}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={isObjective ? "객관식" : "주관식"}
          />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                id="locationId"
                options={locationOptions}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) =>
                  option.locationId === value.locationId
                }
                value={locationId}
                onChange={(event, newValue) => setLocationId(newValue)}
                renderInput={(params) => <TextField {...params} label="지역" required />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="question"
                value={question}
                onChange={(event) => handleValueChange(event, setQuestion)}
                label="질문"
              />
            </Grid>
            {isObjective ? (
              choices.map((choice, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    required
                    fullWidth
                    id={`choice-${index}`}
                    value={choice.content}
                    onChange={(event) => handleChoiceChange(index, event.target.value)}
                    label={`선택지 ${index + 1}`}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={choice.isAnswer}
                        onChange={() => handleAnswerChange(index)}
                        inputProps={{ "aria-label": `isAnswer-${index}` }}
                      />
                    }
                    label="정답"
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="answer"
                  value={choices[0]?.content}
                  onChange={(event) =>
                    handleChoiceChange(0, event.target.value)
                  }
                  label="정답"
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  fontSize: "1rem",
                  height: "56px",
                }}
              >
                {quizId ? "수정" : "등록"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
