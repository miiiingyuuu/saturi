"use client";

import React, { useState, useMemo, MouseEvent } from "react";
import { Card, CardHeader, CardContent, CardActions, Divider, Avatar, Button, Menu, MenuItem, Link, TextField } from "@mui/material";

export default function EditProfilePage() {
  // 상태 변수 선언
  const [nickname, setNickname] = useState('');
  const [email] = useState('email@gmail.com');
  const [dialectKeys, setDialectKeys] = useState(new Set<string>(["경상도"]));
  const [genderKeys, setGenderKeys] = useState(new Set<string>(["남성"]));
  const [ageGroupKeys, setAgeGroupKeys] = useState(new Set<string>(["20대-30대"]));

  // 선택된 값을 문자열로 변환하여 저장
  const dialect = useMemo(
    () => Array.from(dialectKeys).join(", ").replaceAll("_", " "),
    [dialectKeys]
  );

  const gender = useMemo(
    () => Array.from(genderKeys).join(", ").replaceAll("_", " "),
    [genderKeys]
  );

  const ageGroup = useMemo(
    () => Array.from(ageGroupKeys).join(", ").replaceAll("_", " "),
    [ageGroupKeys]
  );

  // 수정 완료 버튼 클릭 시 호출되는 함수
  const handleSave = () => {
    alert('수정된 내용을 저장했습니다.');
  };

  // 드롭다운 메뉴 상태 변수
  const [dialectAnchorEl, setDialectAnchorEl] = useState<null | HTMLElement>(null);
  const [genderAnchorEl, setGenderAnchorEl] = useState<null | HTMLElement>(null);
  const [ageGroupAnchorEl, setAgeGroupAnchorEl] = useState<null | HTMLElement>(null);

  const handleDialectClick = (event: MouseEvent<HTMLElement>) => {
    setDialectAnchorEl(event.currentTarget);
  };

  const handleGenderClick = (event: MouseEvent<HTMLElement>) => {
    setGenderAnchorEl(event.currentTarget);
  };

  const handleAgeGroupClick = (event: MouseEvent<HTMLElement>) => {
    setAgeGroupAnchorEl(event.currentTarget);
  };

  const handleDialectClose = () => {
    setDialectAnchorEl(null);
  };

  const handleGenderClose = () => {
    setGenderAnchorEl(null);
  };

  const handleAgeGroupClose = () => {
    setAgeGroupAnchorEl(null);
  };

  const handleDialectSelect = (key: string) => {
    setDialectKeys(new Set([key]));
    handleDialectClose();
  };

  const handleGenderSelect = (key: string) => {
    setGenderKeys(new Set([key]));
    handleGenderClose();
  };

  const handleAgeGroupSelect = (key: string) => {
    setAgeGroupKeys(new Set([key]));
    handleAgeGroupClose();
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 h-screen">
      <Card sx={{ width: '900px', mt: 6 }}>
        <CardHeader
          avatar={
            <Avatar
              alt="profile image"
              src="https://via.placeholder.com/150"
              sx={{ width: 150, height: 150 }}
            />
          }
          title={
            <div className="flex flex-col">
              <TextField
                label="닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <Divider sx={{ my: 2 }} />
              <p className="text-md font-semibold">이메일</p>
              <p className="text-default-500">{email}</p>
              <Divider sx={{ my: 2 }} />
              <Button variant="outlined" onClick={handleDialectClick}>
                사용하는 사투리: {dialect}
              </Button>
              <Menu
                anchorEl={dialectAnchorEl}
                open={Boolean(dialectAnchorEl)}
                onClose={handleDialectClose}
              >
                <MenuItem onClick={() => handleDialectSelect("경기도")}>경기도</MenuItem>
                <MenuItem onClick={() => handleDialectSelect("경상도")}>경상도</MenuItem>
                <MenuItem onClick={() => handleDialectSelect("전라도")}>전라도</MenuItem>
                <MenuItem onClick={() => handleDialectSelect("충청도")}>충청도</MenuItem>
                <MenuItem onClick={() => handleDialectSelect("강원도")}>강원도</MenuItem>
                <MenuItem onClick={() => handleDialectSelect("제주도")}>제주도</MenuItem>
                <MenuItem onClick={() => handleDialectSelect("알려주고 싶지 않아요")}>알려주고 싶지 않아요</MenuItem>
              </Menu>
              <Divider sx={{ my: 2 }} />
              <Button variant="outlined" onClick={handleGenderClick}>
                성별: {gender}
              </Button>
              <Menu
                anchorEl={genderAnchorEl}
                open={Boolean(genderAnchorEl)}
                onClose={handleGenderClose}
              >
                <MenuItem onClick={() => handleGenderSelect("남성")}>남성</MenuItem>
                <MenuItem onClick={() => handleGenderSelect("여성")}>여성</MenuItem>
                <MenuItem onClick={() => handleGenderSelect("알려주고 싶지 않아요")}>알려주고 싶지 않아요</MenuItem>
              </Menu>
              <Divider sx={{ my: 2 }} />
              <Button variant="outlined" onClick={handleAgeGroupClick}>
                연령대: {ageGroup}
              </Button>
              <Menu
                anchorEl={ageGroupAnchorEl}
                open={Boolean(ageGroupAnchorEl)}
                onClose={handleAgeGroupClose}
              >
                <MenuItem onClick={() => handleAgeGroupSelect("10대-20대")}>10대-20대</MenuItem>
                <MenuItem onClick={() => handleAgeGroupSelect("30대-40대")}>30대-40대</MenuItem>
                <MenuItem onClick={() => handleAgeGroupSelect("50대-60대")}>50대-60대</MenuItem>
                <MenuItem onClick={() => handleAgeGroupSelect("70대 이상")}>70대 이상</MenuItem>
                <MenuItem onClick={() => handleAgeGroupSelect("알려주고 싶지 않아요")}>알려주고 싶지 않아요</MenuItem>
              </Menu>
            </div>
          }
        />
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Link href="/accounts/profile" underline="none">
            <Button variant="contained">뒤로가기</Button>
          </Link>
          <div className="flex space-x-4">
            <Link href="/accounts/profile" underline="none">
              <Button variant="contained" color="primary" onClick={handleSave}>
                수정 완료
              </Button>
            </Link>
            <Link href="/accounts/changepassword" underline="none">
              <Button variant="contained" color="secondary">
                비밀번호 변경
              </Button>
            </Link>
          </div>
        </CardActions>
      </Card>
    </div>
  );
}
