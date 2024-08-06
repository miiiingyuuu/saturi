"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardActions, Divider, Avatar, Button, Menu, MenuItem, Link, TextField, Dialog, DialogTitle, DialogContent, Grid, CircularProgress } from "@mui/material";
import api from "@/lib/axios";

// type 선언
type Gender = 'DEFAULT' | 'MALE' | 'FEMALE';
type AgeRange = 'DEFAULT' | 'CHILD' | 'TEENAGER' | 'TWENTEEN' | 'THIRTEEN' | 'FOURTEEN' | 'FIFTEEN' | 'SIXTEEN' | 'SEVENTEEN' | 'EIGHTEEN' | 'NINETEEN';
type LocationId = 1 | 2 | 3 | 4 | 5 | 6 | 7; // 1: default, 2: gyungsang, 3: gyunggi, etc.

// 프로필 데이터 받아오기
interface UserProfile {
  nickname: string;
  email: string;
  locationId: LocationId;
  gender: Gender;
  ageRange: AgeRange;
  birdId: number;
}

interface ProfileUpdateData {
  nickname: string;
  locationId: LocationId;
  gender: Gender;
  ageRange: AgeRange;
  birdId: number;
  isChanged: number;
}

// 선택지들
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [originalNickname, setOriginalNickname] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const [dialectAnchorEl, setDialectAnchorEl] = useState<null | HTMLElement>(null);
  const [genderAnchorEl, setGenderAnchorEl] = useState<null | HTMLElement>(null);
  const [ageRangeAnchorEl, setAgeRangeAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    // 프로필 가져오기
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found');
        }

        const response = await api.get<UserProfile>('/user/auth/profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        setUserProfile(response.data);
        setOriginalNickname(response.data.nickname);
      } catch {
        console.error('프로필 정보를 가져오는데 실패했습니다:', error);
        setError('프로필 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Menu 관련 함수 선언들
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, [e.target.name]: e.target.value });
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, type: 'dialect' | 'gender' | 'ageRange') => {
    if (type === 'dialect') setDialectAnchorEl(event.currentTarget);
    else if (type === 'gender') setGenderAnchorEl(event.currentTarget);
    else setAgeRangeAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (type: 'dialect' | 'gender' | 'ageRange') => {
    if (type === 'dialect') setDialectAnchorEl(null);
    else if (type === 'gender') setGenderAnchorEl(null);
    else setAgeRangeAnchorEl(null);
  };

  const handleSelect = (type: 'dialect' | 'gender' | 'ageRange', value: LocationId | Gender | AgeRange) => {
    if (userProfile) {
      if (type === 'dialect') {
        setUserProfile({ ...userProfile, locationId: value as LocationId });
      } else if (type === 'gender') {
        setUserProfile({ ...userProfile, gender: value as Gender });
      } else {
        setUserProfile({ ...userProfile, ageRange: value as AgeRange });
      }
    }
    handleMenuClose(type);
  };

  const handleImageClick = () => {
    setIsImageDialogOpen(true);
  };

  const handleImageSelect = (birdId: number) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, birdId });
    }
    setIsImageDialogOpen(false);
  };

  const router = useRouter();

  // 수정 요청
  const handleSave = async () => {
    if (!userProfile) return;

    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const isChanged = userProfile.nickname !== originalNickname ? 1 : 0;
      
      const updateData: ProfileUpdateData = {
        nickname: userProfile.nickname,
        locationId: userProfile.locationId,
        gender: userProfile.gender,
        ageRange: userProfile.ageRange,
        birdId: userProfile.birdId,
        isChanged
      };
      const response = await api.put('/user/auth', updateData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.status === 200) {
        // eslint-disable-next-line no-alert
        alert('프로필이 성공적으로 수정되었습니다.');
        setOriginalNickname(userProfile.nickname);
        router.push('/user/profile');
      }
    } catch {
      console.error('프로필 수정 중 오류가 발생했습니다:', error);
      // eslint-disable-next-line no-alert
      alert('프로필 수정에 실패했습니다.');
    }
  };  

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error || !userProfile) {
    return <div>{error || '프로필을 불러올 수 없습니다.'}</div>;
  }

  return (
    <div className="flex justify-center items-center bg-gray-100 h-screen">
      <Card sx={{ width: '900px', mt: 6 }}>
        <CardHeader
          avatar={
            <Avatar
              alt="profile image"
              src={`/main_profile/${userProfile.birdId}.png`}
              sx={{ width: 150, height: 150 }}
              onClick={handleImageClick}
            />
          }
          title={
            <div className="flex flex-col">
              <TextField
                label="닉네임"
                name="nickname"
                value={userProfile.nickname}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <Divider sx={{ my: 2 }} />
              <p className="text-md font-semibold">이메일</p>
              <p className="text-default-500">{userProfile.email}</p>
              <Divider sx={{ my: 2 }} />
              <Button variant="outlined" onClick={(e) => handleMenuClick(e, 'dialect')}>
                사용하는 사투리: {getFormattedLocationId(userProfile.locationId)}
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
                성별: {getFormattedGender(userProfile.gender)}
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
              <Button variant="outlined" onClick={(e) => handleMenuClick(e, 'ageRange')}>
                연령대: {getFormattedAgeRange(userProfile.ageRange)}
              </Button>
              <Menu
                anchorEl={ageRangeAnchorEl}
                open={Boolean(ageRangeAnchorEl)}
                onClose={() => handleMenuClose('ageRange')}
              >
                {['DEFAULT', 'CHILD', 'TEENAGER', 'TWENTEEN', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'].map((age) => (
                <MenuItem key={age} onClick={() => handleSelect('ageRange', age as AgeRange)}>
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
            <Link href="/user/auth/changepassword" underline="none">
              <Button variant="contained" color="secondary">
                비밀번호 변경
              </Button>
            </Link>
          </div>
        </CardActions>
        <Dialog open={isImageDialogOpen} onClose={() => setIsImageDialogOpen(false)}>
        <DialogTitle textAlign="center" fontWeight="bold">프로필 이미지를 선택하세요!</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
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
