"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card, CardHeader, CardActions,
  Divider,
  Avatar,
  Button,
  List, ListItem, ListItemText,
  Link,
  TextField,
  Dialog, DialogTitle, DialogContent,
  Grid,
  CircularProgress,
  Typography, Box,
} from "@mui/material";
import { handleValueChange, validateNickname } from "@/utils/utils";
import api from "@/lib/axios";
import { getCookie } from "cookies-next";
import { useTheme } from "@mui/material/styles"

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
  const theme = useTheme()
  const isSocial = getCookie("isSocial")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [originalNickname, setOriginalNickname] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const isNicknameValid = useMemo(() => validateNickname(userProfile?.nickname || ""), [userProfile?.nickname]);

  const [dialectModalOpen, setDialectModalOpen] = useState(false);
  const [genderModalOpen, setGenderModalOpen] = useState(false);
  const [ageRangeModalOpen, setAgeRangeModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // 프로필 가져오기
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found');
        }

        const response = await api.get('/user/auth/profile');

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

  const handleModalOpen = (type: 'dialect' | 'gender' | 'ageRange') => {
    if (type === 'dialect') setDialectModalOpen(true);
    else if (type === 'gender') setGenderModalOpen(true);
    else setAgeRangeModalOpen(true);
  };

  const handleModalClose = (type: 'dialect' | 'gender' | 'ageRange') => {
    if (type === 'dialect') setDialectModalOpen(false);
    else if (type === 'gender') setGenderModalOpen(false);
    else setAgeRangeModalOpen(false);
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
    handleModalClose(type);
  };

  function handleAuthNickname() {
    console.log(userProfile)
    console.log(userProfile?.nickname)
    if (userProfile && userProfile.nickname && isNicknameValid) {
      api
        .get("/user/auth/nickname-dupcheck", {
          params: {nickname: userProfile.nickname },
        })
        .then((response) => {
          if (response) {
            if (window.confirm("이 닉네임을 사용하시겠습니까?")) {
              setIsNicknameChecked(true);
            }
          }
        })
        .catch(err=>console.log(err))
    } else {
      alert("유효하지 않은 닉네임 입니다.");
    }
  }

  const handleImageClick = () => {
    setIsImageDialogOpen(true);
  };

  const handleImageSelect = (birdId: number) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, birdId });
    }
    setIsImageDialogOpen(false);
  };

  // 수정 요청
  const handleSave = async () => {
    if (!userProfile) return;

    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      if (!validateNickname(userProfile.nickname)) {
        alert('닉네임은 한글, 영문, 숫자를 포함하여 10글자 미만으로 해주세요.');
        return;
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
      alert('이미 존재하는 닉네임입니다.');
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
              <Box>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={10}>
                    <TextField
                      name="nickname"
                      required
                      fullWidth
                      id="nickname"
                      label="별명"
                      value={userProfile.nickname}
                      onChange={handleInputChange}
                      autoFocus
                      disabled={isNicknameChecked}
                      error={!isNicknameValid}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      variant="contained"
                      disabled={isNicknameChecked}
                      onClick={(event) => {
                        event.preventDefault();
                        handleAuthNickname();
                      }}
                      sx={{
                        fontSize: "0.75rem",
                        height: "56px",
                      }}
                    >
                      중복 확인
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              <Typography sx= {{ fontSize: '11px', color: 'red', ml: 1 }}>닉네임은 한글, 영문, 숫자를 포함하여 1~10자리여야 합니다. (자음/모음만 사용 불가)</Typography>
              <Divider sx={{ my: 2 }} />
              <p className="text-md font-semibold">이메일</p>
              <p className="text-default-500" style={{ fontSize: '20px' }}>{userProfile.email}</p>
              <Divider sx={{ my: 2 }} />
              <Button variant="outlined" onClick={() => handleModalOpen('dialect')}>
                사용하는 사투리: {getFormattedLocationId(userProfile.locationId)}
              </Button>
              <Divider sx={{ my: 2 }} />
              <Button variant="outlined" onClick={() => handleModalOpen('gender')}>
                성별: {getFormattedGender(userProfile.gender)}
              </Button>
              <Divider sx={{ my: 2 }} />
              <Button variant="outlined" onClick={() => handleModalOpen('ageRange')}>
                연령대: {getFormattedAgeRange(userProfile.ageRange)}
              </Button>
            </div>
          }
        />
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Link href="/user/profile" underline="none">
            <Button variant="contained">뒤로가기</Button>
          </Link>
          <div className="flex space-x-4">
            {(isSocial==="false") && (
              <Link href="/user/auth/changepassword" underline="none">
              <Button variant="contained" sx={{ backgroundColor: theme.palette.primary.light }}>
                비밀번호 변경
              </Button>
            </Link>
            )}
            <Button variant="contained" color="primary" onClick={handleSave}>
              수정 완료
            </Button>
          </div>
        </CardActions>
      </Card>

      {/* 프로필 이미지 선택 다이얼로그 */}
      <Dialog open={isImageDialogOpen} onClose={() => setIsImageDialogOpen(false)}>
        <DialogTitle textAlign="center" fontWeight="bold">프로필 이미지를 선택하세요!</DialogTitle>
        <DialogContent sx={{ alignItems: 'center' }}>
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

      {/* 사투리 선택 모달 */}
      <Dialog open={dialectModalOpen} onClose={() => handleModalClose('dialect')}>
        <DialogTitle>사용하는 사투리 선택</DialogTitle>
        <Divider/>
        <DialogContent>
          <List>
            {[1, 2, 3, 4, 5, 6, 7].map((id) => (
              <ListItem button key={id} onClick={() => handleSelect('dialect', id as LocationId)}>

                <ListItemText primary={getFormattedLocationId(id)} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* 성별 선택 모달 */}
      <Dialog open={genderModalOpen} onClose={() => handleModalClose('gender')}>
        <DialogTitle>성별 선택</DialogTitle>
        <Divider/>
        <DialogContent>
          <List>
            {['DEFAULT', 'MALE', 'FEMALE'].map((gender) => (
              <ListItem button key={gender} onClick={() => handleSelect('gender', gender as Gender)}>
                <ListItemText primary={getFormattedGender(gender)} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* 연령대 선택 모달 */}
      <Dialog open={ageRangeModalOpen} onClose={() => handleModalClose('ageRange')}>
        <DialogTitle>연령대 선택</DialogTitle>
        <Divider/>
        <DialogContent>
          <List>
            {['DEFAULT', 'CHILD', 'TEENAGER', 'TWENTEEN', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'].map((age) => (
              <ListItem button key={age} onClick={() => handleSelect('ageRange', age as AgeRange)}>
                <ListItemText primary={getFormattedAgeRange(age)} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
}
