"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardActions, Divider, Avatar, Button, Menu, MenuItem, TextField, Typography, Grid, Box } from "@mui/material";
import { useRouter } from 'next/navigation';
import { getProfile, getAllCookies, updateProfile } from "@/utils/profile";
import Image from 'next/image';
import { FaCrown, FaFire } from "react-icons/fa";

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    profileImageURL: '',
    nickname: '',
    email: '',
    locationName: '',
    gender: '',
    ageRange: '',
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuType, setMenuType] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      const cookies = getAllCookies();
      const imageURL = await getProfile();
      setProfile({
        profileImageURL: imageURL,
        nickname: cookies.nickname || '',
        email: cookies.email || '',
        locationName: cookies.locationName || '',
        gender: cookies.gender || '',
        ageRange: cookies.ageRange || '',
      });
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleMenuClick = (event, type) => {
    setAnchorEl(event.currentTarget);
    setMenuType(type);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuSelect = (value) => {
    setProfile({ ...profile, [menuType]: value });
    handleMenuClose();
  };

  const handleSave = async () => {
    try {
      await updateProfile(profile);
      alert('프로필이 업데이트되었습니다.');
      router.push('/user/profile');
    } catch (error) {
      console.error('프로필 업데이트 중 오류 발생:', error);
      alert('프로필 업데이트에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen py-8">
      <Card sx={{ width: '900px', mt: 6 }}>
        <Grid container spacing={2}>
          {/* 프로필 정보 섹션 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2 }}>
              <Avatar
                alt="profile image"
                src={profile.profileImageURL || "/default-profile.png"}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <TextField
                label="닉네임"
                name="nickname"
                value={profile.nickname}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <Typography variant="subtitle1">{profile.email}</Typography>
              <Button variant="outlined" onClick={(e) => handleMenuClick(e, 'locationName')} sx={{ mt: 2, width: '100%' }}>
                사용하는 사투리: {profile.locationName}
              </Button>
              <Button variant="outlined" onClick={(e) => handleMenuClick(e, 'gender')} sx={{ mt: 2, width: '100%' }}>
                성별: {profile.gender}
              </Button>
              <Button variant="outlined" onClick={(e) => handleMenuClick(e, 'ageRange')} sx={{ mt: 2, width: '100%' }}>
                연령대: {profile.ageRange}
              </Button>
            </Box>
          </Grid>

          {/* 대시보드 섹션 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2 }}>
              <Card sx={{ mb: 2, p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FaCrown color="gold" />
                  <Typography variant="h6" sx={{ ml: 1 }}>전체 19위</Typography>
                </Box>
                <Typography>59.01%</Typography>
                <Typography>4일째 접속중!</Typography>
              </Card>

              <Card sx={{ mb: 2, p: 2, bgcolor: 'success.light' }}>
                <Typography variant="h6">최근 푼 문제</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Avatar sx={{ bgcolor: 'green', mr: 2 }}>GO</Avatar>
                  <Box>
                    <Typography>경상도 사투리 - 입상</Typography>
                    <Typography>평균 정확도: 75.93%</Typography>
                  </Box>
                </Box>
              </Card>

              <Card sx={{ p: 2, bgcolor: 'error.light' }}>
                <Typography variant="h6">주간 학습</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                    <Button key={day} variant="contained" size="small" color={index < 5 ? "primary" : "default"}>
                      {day}
                      {index < 5 && <FaFire style={{ marginLeft: '4px' }} />}
                    </Button>
                  ))}
                </Box>
              </Card>
            </Box>
          </Grid>
        </Grid>

        <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Button variant="contained" onClick={() => router.push('/user/profile')}>
            뒤로가기
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            수정 완료
          </Button>
        </CardActions>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {/* 메뉴 아이템들 (이전과 동일) */}
        </Menu>
      </Card>
    </div>
  );
}