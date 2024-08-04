"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardActions, Divider, Avatar, Button, Menu, MenuItem, Link, TextField, Dialog, DialogTitle, DialogContent, Grid, CircularProgress } from "@mui/material";
import api from "@/lib/axios";

// type 선언
type Gender = 'DEFAULT' | 'MALE' | 'FEMALE';
type AgeRange = 'DEFAULT' | 'CHILD' | 'TEENAGER' | 'TWENTEEN' | 'THIRTEEN' | 'FOURTEEN' | 'FIFTEEN' | 'SIXTEEN' | 'SEVENTEEN' | 'EIGHTEEN' | 'NINETEEN';
type LocationId = 1 | 2 | 3 | 4 | 5 | 6 | 7; // 1: default, 2: gyungsang, 3: gyunggi, etc.

// 프로필 데이터 받아오기
interface Profile {
  nickname: string;
  locationId: LocationId;
  gender: Gender;
  ageRange: AgeRange;
  birdId: number;
  email?: string;
}

const profileImages = [
  { id: 1, src: '/main_profile/1.png' },
  { id: 2, src: '/main_profile/2.png' },
  { id: 3, src: '/main_profile/3.png' },
  { id: 4, src: '/main_profile/4.png' },
  { id: 5, src: '/main_profile/5.png' },
  { id: 6, src: '/main_profile/6.png' },
  { id: 7, src: '/main_profile/7.png' },
  { id: 8, src: '/main_profile/8.png' },
  { id: 9, src: '/main_profile/9.png' },
  { id: 10, src: '/main_profile/10.png' },
  { id: 11, src: '/main_profile/11.png' },
  { id: 12, src: '/main_profile/12.png' },
  { id: 13, src: '/main_profile/13.png' },
  { id: 14, src: '/main_profile/14.png' },
  { id: 15, src: '/main_profile/15.png' },
  { id: 16, src: '/main_profile/16.png' },
  { id: 17, src: '/main_profile/17.png' },
  { id: 18, src: '/main_profile/18.png' },
];


const getFormattedGender = (gender: string): string => {
  switch (gender) {
    case 'DEFAULT': return '정보 입력 안함';
    case 'FEMALE': return '여자';
    case 'MALE': return '남자';
    default: return '정보 입력 안함';    
  }
};

const getFormattedAgeRange = (ageRange: string): string => {
  switch (ageRange) {
    case 'DEFAULT': return '정보 입력 안함';
    case 'CHILD': return '영유아';
    case 'TEENAGER': return '10대';
    case 'TWENTEEN': return '20대';
    case 'THIRTEEN': return '30대';
    case 'FOURTEEN': return '40대';
    case 'FIFTEEN': return '50대';
    case 'SIXTEEN': return '60대';
    case 'SEVENTEEN': return '70대';
    case 'EIGHTEEN': return '80대';
    case 'NINETEEN': return '90대';
    default: return '정보 입력 안함';
  }
};

const getFormattedLocationId = (locationId: number): string => {
  switch (locationId) {
    case 1: return '정보 입력 안함';
    case 2: return '경상도';
    case 3: return '경기도';
    case 4: return '강원도';
    case 5: return '충청도';
    case 6: return '전라도';
    case 7: return '제주도';
    default: return '정보 입력 안함';
  }
};

// 프로필 수정 로직
export default function EditProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialectAnchorEl, setDialectAnchorEl] = useState<null | HTMLElement>(null);
  const [genderAnchorEl, setGenderAnchorEl] = useState<null | HTMLElement>(null);
  const [ageGroupAnchorEl, setAgeGroupAnchorEl] = useState<null | HTMLElement>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  useEffect(() => {
    // 프로필 가져오기
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found');
        }
        const response = await api.get<Profile>('/user/auth/profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setProfile(response.data);
        setOriginalProfile(response.data);
      } catch (error) {
        console.error('프로필 정보 가져오는데 실패함', error);
        setError('프로필 정보를 불러오는데 실패함');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profile) {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    }
  };

  // 수정 요청
  const handleSave = async () => {
    if (!profile || !originalProfile) return;

    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const isChanged = profile.nickname !== originalProfile.nickname ? 1 : 0;
      
      // 서버에 전송할 데이터 구조 조정
      const response = await api.put('/user/auth', 
        {
          ...profile,
          isChanged,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.status === 200) {
        alert('프로필이 성공적으로 수정되었습니다.');
        setOriginalProfile(profile);
      }
    } catch (error) {
      console.error('프로필 수정 중 오류가 발생했습니다:', error);
      alert('프로필 수정에 실패했습니다.');
    }
  };

  // Menu 관련 함수 선언들
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, type: 'dialect' | 'gender' | 'ageGroup') => {
    if (type === 'dialect') setDialectAnchorEl(event.currentTarget);
    else if (type === 'gender') setGenderAnchorEl(event.currentTarget);
    else setAgeGroupAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (type: 'dialect' | 'gender' | 'ageGroup', ) => {
    if (type === 'dialect') setDialectAnchorEl(null);
    else if (type === 'gender') setGenderAnchorEl(null);
    else setAgeGroupAnchorEl(null);
  };

  const handleSelect = (type: 'dialect' | 'gender' | 'ageGroup', value: LocationId | Gender | AgeRange) => {
    if (profile) {
      if (type === 'dialect') {
        setProfile({ ...profile, locationId: value as LocationId });
      } else if (type === 'gender') {
        setProfile({ ...profile, gender: value as Gender });
      } else {
        setProfile({ ...profile, ageRange: value as AgeRange });
      }
    }
    handleMenuClose(type);
  };

  const handleImageClick = () => {
    setIsImageDialogOpen(true);
  };

  const handleImageSelect = (birdId: number) => {
    if (profile) {
      setProfile({ ...profile, birdId });
    }
    setIsImageDialogOpen(false);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error || !profile) {
    return <div>{error || '프로필을 불러올 수 없습니다.'}</div>;
  }

  return (
    <div className="flex justify-center items-center bg-gray-100 h-screen">
      <Card sx={{ width: '900px', mt: 6 }}>
        <CardHeader
          avatar={
            <Avatar
              alt="profile image"
              src={`/main_profile/${profile.birdId}.png`}
              sx={{ width: 150, height: 150 }}
              onClick={handleImageClick}
            />
          }
          title={
            <div className="flex flex-col">
              <TextField
                label="닉네임"
                name="nickname"
                value={profile.nickname}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <Divider sx={{ my: 2 }} />
              <p className="text-md font-semibold">이메일</p>
              <p className="text-default-500">{profile.email}</p>
              <Divider sx={{ my: 2 }} />
              <Button variant="outlined" onClick={(e) => handleMenuClick(e, 'dialect')}>
                사용하는 사투리: {getFormattedLocationId(profile.locationId)}
              </Button>
              <Menu
                anchorEl={dialectAnchorEl}
                open={Boolean(dialectAnchorEl)}
                onClose={() => handleMenuClose('dialect')}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((id) => (
                <MenuItem key={id} onClick={() => handleSelect('dialect', id as LocationId)}>
                  {getFormattedLocationId(id)}
                </MenuItem>
                ))}
              </Menu>
              <Divider sx={{ my: 2 }} />
              <Button variant="outlined" onClick={(e) => handleMenuClick(e, 'gender')}>
                성별: {getFormattedGender(profile.gender)}
              </Button>
              <Menu
                anchorEl={genderAnchorEl}
                open={Boolean(genderAnchorEl)}
                onClose={() => handleMenuClose('gender')}
              >
                {['DEFAULT', 'MALE', 'FEMALE'].map((gender) => (
                  <MenuItem key={gender} onClick={() => handleSelect('gender', gender as Gender)}>
                    {getFormattedGender(gender)}
                  </MenuItem>
                ))}
              </Menu>
              <Divider sx={{ my: 2 }} />
              <Button variant="outlined" onClick={(e) => handleMenuClick(e, 'ageGroup')}>
                연령대: {getFormattedAgeRange(profile.ageRange)}
              </Button>
              <Menu
                anchorEl={ageGroupAnchorEl}
                open={Boolean(ageGroupAnchorEl)}
                onClose={() => handleMenuClose('ageGroup')}
              >
                {['DEFAULT', 'CHILD', 'TEENAGER', 'TWENTEEN', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'].map((age) => (
                <MenuItem key={age} onClick={() => handleSelect('ageGroup', age as AgeRange)}>
                  {getFormattedAgeRange(age)}
                </MenuItem>
              ))}
              </Menu>
            </div>
          }
        />
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Link href="/user/profile" underline="none">
            <Button variant="contained">뒤로가기</Button>
          </Link>
          <div className="flex space-x-4">
            <Button variant="contained" color="primary" onClick={handleSave}>
              수정 완료
            </Button>
            <Link href="/accounts/changepassword" underline="none">
              <Button variant="contained" color="secondary">
                비밀번호 변경
              </Button>
            </Link>
          </div>
        </CardActions>
        <Dialog open={isImageDialogOpen} onClose={() => setIsImageDialogOpen(false)}>
        <DialogTitle textAlign={ 'center' }>프로필 이미지를 선택하세요!</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {profileImages.map((img) => (
              <Grid item key={img.id} xs={4}>
                <Avatar
                  src={img.src}
                  alt={`Profile ${img.id}`}
                  sx={{ width: 100, height: 100, cursor: 'pointer' }}
                  onClick={() => handleImageSelect(img.id)}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
      </Card>
    </div>
  );
}