"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Card, 
  CardContent, 
  CardActions,
  CardHeader,
  Button, 
  Typography, 
  Avatar,
  Box,
  Divider,
  LinearProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@mui/material";
import { useTheme } from "@mui/material/styles";  // 이 줄을 추가
import { FaCrown, FaFire } from "react-icons/fa";
import { getProfile, getAllCookies } from "@/utils/profile";
import { getCookie } from "cookies-next";

export default function ProfilePage() {
  const theme = useTheme();  // 이 줄을 추가
  const [profile, setProfile] = useState({
    profileImageURL: '',
    exp: '',
    nickname: '',
    email: '',
    ageRange: '',
    gender: '',
    locationName: '',
  });

  useEffect(() => {
    // 쿠키에서 프로필 정보 가져오기
    const cookies = getAllCookies();

    // 프로필 이미지 설정
    const fetchProfileImage = async () => {
      if (getCookie("birdId")) {
        const ImageURL = await getProfile();
        setProfile(prevProfile => ({
          ...prevProfile,
          profileImageURL: ImageURL
        }));
      }
    };

    fetchProfileImage();

    const getFormattedGender = (gender: string): string => {
      switch (gender) {
        case 'DEFAULT':
          return '정보 입력 안함';
        case 'FEMALE':
          return '여자';
        case 'MALE':
          return '남자';
        default:
          return '정보 입력 안함';    
      }
    };

    const getFormattedAgeRange = (ageRange: string): string => {
      switch (ageRange) {
        case 'DEFAULT':
          return '정보 입력 안함';
        case 'CHILD':
          return '영유아';
        case 'TEENAGER':
          return '10대';
        case 'TWENTEEN':
          return '20대';
        case 'THIRTEEN':
          return '30대';
        case 'FOURTEEN':
          return '40대';
        case 'FIFTEEN':
          return '50대';
        case 'SIXTEEN':
          return '60대';
        case 'SEVENTEEN':
          return '70대';
        case 'EIGHTEEN':
          return '80대';
        case 'NINETEEN':
          return '90대';
        default:
          return '정보 입력 안함'; // 기본값 처리
      }
    };

    const getFormattedLocationName = (locationName: string): string => {
      switch (locationName) {
        case 'default':
          return '정보 입력 안함';
        case 'gyungsang':
          return '경상도';
        case 'gyunggi':
          return '경기도';
        case 'gangwon':
          return '강원도';
        case 'chungcheong':
          return '충청도';
        case 'jeonra':
          return '전라도';
        case 'jeju':
          return '제주도';
        default:
          return '정보 입력 안함';
      }
    }

    setProfile(prevProfile => ({
      ...prevProfile,
      exp: (cookies.exp as string) || '없음',
      nickname: (cookies.nickname as string) || '없음',
      email: (cookies.email as string) || '없음',
      ageRange: getFormattedAgeRange(cookies.ageRange as string),
      gender: getFormattedGender(cookies.gender as string),
      locationName: getFormattedLocationName(cookies.locationName as string),
    }));
  }, []);

  return (
    <Box>
      {/* 프로필 */}
      <div className="flex justify-center items-center bg-gray-100">
        <Card style={{ width: '900px', marginTop: '50px' }}>
          <CardHeader
            avatar={
              <Avatar
                alt="profile image"
                src={profile.profileImageURL ? `/main_profile/${profile.profileImageURL}` : "/default-profile.png"}
                sx={{ width: 150, height: 150 }}
              />
            }
            title={
              <div>
                <Typography variant="h6">{profile.nickname}</Typography>
                <Typography variant="body2" color="textSecondary">{profile.email}</Typography>
              </div>
            }
          />
          <Divider />
          <CardContent>
            <Typography variant="subtitle1">사용하는 사투리</Typography>
            <Typography variant="body2" color="textSecondary">{profile.locationName}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">성별</Typography>
            <Typography variant="body2" color="textSecondary">{profile.gender}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">연령대</Typography>
            <Typography variant="body2" color="textSecondary">{profile.ageRange}</Typography>
          </CardContent>
          <CardActions>
            <Link href="/user/profile/update" passHref>
              <Button variant="contained">프로필 수정</Button>
            </Link>
          </CardActions>
        </Card>
      </div>

      {/* 대쉬보드 */}
      <div className="flex justify-center items-center bg-gray-100 h-screen">
        <Card style={{ width: '900px', marginTop: '20px' }}>
          <CardHeader
            title={<Typography variant="h5" component="div">학습 대시보드</Typography>}
          />
          <CardContent>
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-12">
              {/* 전체 19위 섹션 */}
              <div className="col-span-1 sm:col-span-4" style={{ backgroundColor: theme.palette.primary.main, borderRadius: '8px', padding: '16px', color: 'white' }}>
                <div className="flex items-center gap-2 mb-2">
                  <FaCrown color="gold" />
                  <Typography variant="h6" component="p">전체 19위</Typography>
                </div>
                <LinearProgress variant="determinate" value={59.01} color="secondary" />
                <Typography variant="body2" component="p" sx={{ mt: 2 }}>59.01%</Typography>
                <Typography variant="body2" component="p">4일째 접속중!</Typography>
              </div>

              {/* 최근 푼 문제 섹션 */}
              <div className="col-span-1 sm:col-span-8" style={{ backgroundColor: theme.palette.success.main, borderRadius: '8px', padding: '16px', color: 'white' }}>
                <Typography variant="h6" component="h4" sx={{ mb: 2 }}>최근 푼 문제</Typography>
                <div className="flex items-center gap-4">
                  <Avatar>GO</Avatar>
                  <div>
                    <Typography variant="body2" component="p">경상도 사투리 - 휘미</Typography>
                    <LinearProgress variant="determinate" value={75.93} color="success" />
                    <Typography variant="body2" component="p" sx={{ mt: 1 }}>평균 정확도: 75.93%</Typography>
                  </div>
                </div>
              </div>

              {/* 주간 학습 섹션 */}
              <div className="col-span-1 sm:col-span-12" style={{ backgroundColor: theme.palette.error.main, borderRadius: '8px', padding: '16px', color: 'white' }}>
                <Typography variant="h6" component="h4" sx={{ mb: 2 }}>주간 학습</Typography>
                <div className="flex gap-2 flex-wrap">
                  {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                    <Button key={day} variant="contained" size="small">
                      {day}
                      {index < 4 && <FaFire className="ml-1" />}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 연간 학습 섹션 */}
              <div className="col-span-1 sm:col-span-12" style={{ backgroundColor: theme.palette.primary.dark, borderRadius: '8px', padding: '16px', color: 'white' }}>
                <Typography variant="h6" component="h4" sx={{ mb: 2 }}>연간 학습</Typography>
                <Table sx={{ color: 'white' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Jan</TableCell>
                      <TableCell>Feb</TableCell>
                      {/* ... 나머지 월 */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{/* Jan 1주차 데이터 */}</TableCell>
                      <TableCell>{/* Feb 1주차 데이터 */}</TableCell>
                      {/* ... 나머지 월 */}
                    </TableRow>
                    {/* ... 나머지 주차 */}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Box>
  );
}
