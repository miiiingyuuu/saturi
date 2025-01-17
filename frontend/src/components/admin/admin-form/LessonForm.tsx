import {
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { handleValueChange } from "@/utils/utils";
import { getLessonGroup } from "@/utils/adminutils";
import { LessonGroup, LessonProps } from "@/utils/props";
import { useRouter } from "next/navigation";

export default function LessonForm({ lessonId }: { lessonId?: number }) {
  const router = useRouter()
  const [lessonGroup, setLessonGroup] = useState<LessonGroup | null>(null);
  const [script, setScript] = useState<string>("");
  const [sampleVoice, setSampleVoice] = useState<File | null>(null);
  const [lessonGroupOptions, setLessonGroupOptions] = useState<LessonGroup[] | null>(null);
  const [sampleVoiceName, setSampleVoiceName] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      const data = await getLessonGroup();
      setLessonGroupOptions(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (lessonId && lessonGroupOptions) {
      api.get<LessonProps>(`/admin/lesson/${lessonId}`)
        .then(response => {
          const { lessonGroupId, script, sampleVoiceName } = response.data;

          // 불러온 데이터로 폼을 세팅
          const group = lessonGroupOptions.find(option => option.lessonGroupId === lessonGroupId);
          setLessonGroup(group || null);
          setScript(script);
          setSampleVoiceName(sampleVoiceName);
        })
        .catch(error => console.error('Error fetching lesson data:', error));
    }
  }, [lessonId, lessonGroupOptions]);

  function createOrUpdateLesson() {
    const formData = new FormData();

    if (sampleVoice) {
      formData.append("sampleVoice", sampleVoice);
    }
    formData.append("script", script);
    if (lessonGroup) {
      formData.append("lessonGroupId", lessonGroup.lessonGroupId.toString());
    }

    const apiCall = lessonId
      ? api.put(`/admin/lesson/${lessonId}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      : api.post("/admin/lesson", formData, { headers: { "Content-Type": "multipart/form-data" } });

    apiCall
      .then(response => {
        alert(lessonId ? "수정되었습니다." : "등록되었습니다.");
        router.push("/admin/lesson/view")
      })
      .catch(error => console.error('Error:', error));
  }

  function handleVoiceFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files ? event.target.files[0] : null;
    setSampleVoice(file);
    setSampleVoiceName(""); // 새 파일이 선택되면 기존 파일 이름 리셋
  }

  return (
    <Box
      component="form"
      noValidate
      onSubmit={event => {
        event.preventDefault();
        createOrUpdateLesson();
      }}
      sx={{ mt: 3 }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            id="locationId"
            options={lessonGroupOptions || []}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.lessonGroupId === value.lessonGroupId}
            value={lessonGroup}
            onChange={(event, newValue) => setLessonGroup(newValue)}
            renderInput={(params) => <TextField {...params} label="그룹" required />}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TextField
            disabled
            label="지역"
            id="outlined-disabled"
            value={lessonGroup ? lessonGroup.locationName : "지역"}
          />
          <TextField
            disabled
            label="카테고리"
            id="outlined-disabled"
            value={lessonGroup ? lessonGroup.lessonCategoryName : "카테고리"}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="script"
            value={script}
            onChange={(event) => handleValueChange(event, setScript)}
            label="스크립트"
          />
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body1" sx={{ mr: 2 }}>
              {sampleVoiceName ? `${sampleVoiceName}` : sampleVoice ? `선택한 파일: ${sampleVoice.name}` : "파일을 선택하세요"}
            </Typography>
            <div>
              <label htmlFor="file-upload">
                <input
                  accept="audio/*"
                  id="file-upload"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleVoiceFile}
                />
                <Button variant="contained" component="span">
                  파일 선택
                </Button>
              </label>
            </div>
          </Box>
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
            {lessonId ? "수정" : "등록"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
