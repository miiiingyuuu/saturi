import {
  Box,
  Grid,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { handleValueChange } from "@/utils/utils";
import { ILessonCategoryProps, ILocationProps } from "@/utils/props";
import {
  getLocation,
  getLessonCategory,
} from "@/utils/adminutils";

export default function LessonGroupForm() {
  const [locationId, setLocationId] = useState<ILocationProps | null>(null);
  const [locationOptions, setLocationOptions] = useState<ILocationProps[]>([]);
  const [lessonCategory, setLessonCategory] = useState<ILessonCategoryProps | null>(null);
  const [lessonCategoryOptions, setLessonCategoryOptions] = useState<ILessonCategoryProps[]>([]);
  const [name, setName] = useState("");

  // 레슨 그룹 생성
  function createLessonGroup() {
    api.post("admin/lesson/lesson-group", {
      locationId: locationId?.locationId,
      lessonCategoryId: lessonCategory?.lessonCategoryId,
      name,
    }).then(response => {
      console.log(response.data);
    })
      .catch(error => {
        if (error.response.status === 400) {
          alert("9개 넘음");
        }
      });
  }

  // 데이터 비동기 처리
  useEffect(() => {
    async function fetchData() {
      const location = await getLocation();
      setLocationOptions(location);
      const cat = await getLessonCategory();
      setLessonCategoryOptions(cat);
    }
    
    fetchData();
  }, []);

  return (
    <Box
      component="form"
      noValidate
      onSubmit={event => {
        event.preventDefault();
        createLessonGroup();
      }}
      sx={{ mt: 3 }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            id="locationId"
            options={locationOptions}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.locationId === value.locationId}
            value={locationId}
            onChange={(event, newValue) => setLocationId(newValue)}
            renderInput={(params) => <TextField {...params} label="지역" required />}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            id="lessonCategoryId"
            options={lessonCategoryOptions}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.lessonCategoryId === value.lessonCategoryId}
            value={lessonCategory}
            onChange={(event, newValue) => setLessonCategory(newValue)}
            renderInput={(params) => <TextField {...params} label="카테고리" required />}
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
  );
}
