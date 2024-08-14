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
import {getFormattedLocationId, handleValueChange, validateNickname} from "@/utils/utils";
import api from "@/lib/axios";
import { getCookie } from "cookies-next";
import { useTheme } from "@mui/material/styles"
import CustomButton from "@/components/ButtonColor";

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
  { id: 1, src: '/main_profile/1.png', name: '광부무새'},
  { id: 2, src: '/main_profile/2.png', name: '은행원무새' },
  { id: 3, src: '/main_profile/3.png', name: '어릿광대무새' },
  { id: 4, src: '/main_profile/4.png', name: '선원무새' },
  { id: 5, src: '/main_profile/5.png', name: '갑판원무새' },
  { id: 6, src: '/main_profile/6.png', name: '악의수장무새' },
  { id: 7, src: '/main_profile/7.png', name: '총기병무새' },
  { id: 8, src: '/main_profile/8.png', name: '살인마무새' },
  { id: 9, src: '/main_profile/9.png', name: '잡화상무새' },
  { id: 10, src: '/main_profile/10.png', name: '요원무새' },
  { id: 11, src: '/main_profile/11.png', name: '석유부자무새' },
  { id: 12, src: '/main_profile/12.png', name: '빨간머리무새' },
  { id: 13, src: '/main_profile/13.png', name: '정찰대무새' },
  { id: 14, src: '/main_profile/14.png', name: '비밀결사무세' },
  { id: 15, src: '/main_profile/15.png', name: '쇼호스트무새' },
  { id: 16, src: '/main_profile/16.png', name: '용병무새' },
  { id: 17, src: '/main_profile/17.png', name: '기관사무세' },
  { id: 18, src: '/main_profile/18.png', name: '삼총사무새'},
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

  const isChanged = useMemo(() => userProfile?.nickname !== originalNickname, [userProfile])

  const router = useRouter();


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
    if (!isChanged) {
     if (window.confirm("현재 사용 중인 별명과 동일합니다.\n변경하지 않고 그대로 사용하시겠습니까?")) {
       setIsNicknameChecked(true)
      }
    } else if (userProfile && userProfile.nickname && isNicknameValid) {
      api
        .get("/user/auth/nickname-dupcheck", {
          params: {nickname: userProfile.nickname },
        })
        .then((response) => {
          if (response) {
            if (window.confirm("이 별명을 사용하시겠습니까?")) {
              setIsNicknameChecked(true);
            }
          }
        })
        .catch(()=> alert("이미 존재하는 별명 입니다."))
    } else {
      alert("유효하지 않은 별명 입니다.");
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
  function handleSave() {
    if (!validateNickname(userProfile?.nickname || "")) {
      alert("별명은 한글, 영문, 숫자를 포함하여 10글자 미만으로 해주세요.")
      return
    } else if (isChanged && !isNicknameChecked) {
      alert("별명 중복 검사를 해주세요.")
      return

    }
    if (userProfile) {
    api.put("/user/auth", {
      nickname: userProfile.nickname,
      locationId: userProfile.locationId,
      gender: userProfile.gender,
      ageRange: userProfile.ageRange,
      birdId: userProfile.birdId,
      isChanged: isChanged? 1 : 0
    }).then((response) => {
      alert('프로필이 성공적으로 수정되었습니다.');
      router.push('/user/profile');
    }).catch((err) => {
        console.error("프로필 수정 중 오류가 발생했습니다:", error);
        // eslint-disable-next-line no-alert
        alert("이미 존재하는 별명입니다.");
      }
    )
    }
  }

  useEffect(() => {
    // 프로필 가져오기
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
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

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error || !userProfile) {
    return <div>{error || '프로필을 불러올 수 없습니다.'}</div>;
  }

  return (
    <div className="flex justify-center items-center bg-gray-100 h-screen">
      <Card sx={{ width: '900px' }}>
        <CardHeader
          avatar={
            <Avatar
              alt="profile image"
              src={`/main_profile/${userProfile.birdId}.png`}
              sx={{
                width: 150,
                height: 150,
                cursor: 'pointer', // 마우스 커서를 포인터로 변경
                '&:hover': {
                  opacity: 0.8, // 호버 시 약간 투명해지는 효과 (선택사항)
                  boxShadow: 3,
                }
              }}
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
                    <CustomButton
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
                    </CustomButton>
                  </Grid>
                </Grid>
              </Box>
              <Typography sx= {{ fontSize: '11px', ml: 1, mt: 1 }}> * 닉네임은 한글, 영문, 숫자를 포함하여 1~10자리여야 합니다. (자음/모음만 사용 불가)</Typography>
              <Divider sx={{ my: 2 }} />
              <p className="text-md font-semibold">이메일</p>
              <p className="text-default-500" style={{ fontSize: '20px' }}>{userProfile.email}</p>
              <Divider sx={{ my: 2 }} />
              <CustomButton variant="outlined" onClick={() => handleModalOpen('dialect')}>
                사용하는 사투리: {getFormattedLocationId(userProfile.locationId)}
              </CustomButton>
              <Divider sx={{ my: 2 }} />
              <CustomButton variant="outlined" onClick={() => handleModalOpen('gender')}>
                성별: {getFormattedGender(userProfile.gender)}
              </CustomButton>
              <Divider sx={{ my: 2 }} />
              <CustomButton variant="outlined" onClick={() => handleModalOpen('ageRange')}>
                연령대: {getFormattedAgeRange(userProfile.ageRange)}
              </CustomButton>
            </div>
          }
        />
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Link href="/user/profile" underline="none">
            <CustomButton variant="contained">뒤로가기</CustomButton>
          </Link>
          <div className="flex space-x-4">
            {(isSocial==="false") && (
              <Link href="/user/auth/changepassword" underline="none">
              <CustomButton variant="contained" sx={{ backgroundColor: '#4db6ac !important' }}>
                비밀번호 변경
              </CustomButton>
            </Link>
            )}
            <CustomButton variant="contained" color="primary" onClick={handleSave}>
              수정 완료
            </CustomButton>
          </div>
        </CardActions>
      </Card>

      {/* 프로필 이미지 선택 다이얼로그 */}
      <Dialog open={isImageDialogOpen} onClose={() => setIsImageDialogOpen(false)}>
        <DialogTitle textAlign="center" fontWeight="bold">프로필 이미지를 선택하세요!</DialogTitle>
        <DialogContent sx={{ alignItems: 'center' }}>
          <Grid container spacing={3} justifyContent='center' alignItems="center">
            {profileImages.map((img) => (
              <Grid item key={img.id} xs={4} 
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  src={img.src}
                  alt={`Profile ${img.id}`}
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: 3,
                    }
                  }}
                  onClick={() => handleImageSelect(img.id)}
                />
                <Typography variant="subtitle1" mt={1}>
                  {img.name}
                </Typography>
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
