"use client";

import {
  Typography,
  Box,
  Container,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import api from "@/lib/axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { handleValueChange } from "@/utils/utils";
import {
  // getLessonGroup,
  getLocation,
  getLessonCategory,
} from "@/utils/adminutils"

export default function App() {
  const pathname = usePathname();
  const [category, method] = pathname?.split("/").slice(-2) || [];
  const [locationId, setLocationId] = useState({});
  const [lessonCategoryId, setLessonCategoryId] = useState({});
  const [name, setName] = useState("");

  function createLessonGroup() {
    api.post("/admin/lesson/lesson-group", {
      locationId,
      lessonCategoryId,
      name
    }).then((response) => {
      console.log(response.data)
      // 1,2,3 넣었을 때 ok 확인 받아봄
    })
  }
  // TODO: 어지간하면 데이터 담기 전에 전처리 해서 담기
  // 함수 내부에서 미리 전처리해서 state 에 담으면 될듯
  useEffect(() => {
    setLocationId(getLocation)
    setLessonCategoryId(getLessonCategory)
  }, []);

  if (category === "lesson" && method === "create") {
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
            레슨 그룹 등록
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={event => {
              event.preventDefault();
              createLessonGroup()
              }
            }
            sx={{ mt: 3 }}
          >
            <Grid container spacing={3}> {/* Add spacing here */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="locationId"
                  value={locationId}
                  onChange={(event) => handleValueChange(event, setLocationId)}
                  label="지역 ID"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="lessonCategoryId"
                  value={lessonCategoryId}
                  onChange={(event) => handleValueChange(event, setLessonCategoryId)}
                  label="카테고리 ID"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  value={name}
                  onChange={(event) => handleValueChange(event, setName)}
                  label="레슨 그룹 이름"
                />
              </Grid>
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
                  등록
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    );
  }
  return null;
}
