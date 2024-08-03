"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Button, 
  Typography, 
  Avatar,
  Box,
  Divider,
  LinearProgress,
  Grid,
  Paper
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FaCrown, FaFire, FaMapMarkerAlt, FaUserAlt, FaUsers } from "react-icons/fa";
import { getProfile, getAllCookies } from "@/utils/profile";
import { getCookie } from "cookies-next";
import Image from 'next/image';
import Tier from '@/components/profile/tier'
import Rank from "@/components/profile/rank";
import { getUserExpInfo } from "@/utils/profile";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [profile, setProfile] = useState({
    profileImageURL: '',
    exp: '',
    nickname: '',
    email: '',
    ageRange: '',
    gender: '',
    locationName: '',
    isLoading: '',
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

    // 랭킹 데이터 받아오기
    const fetchUserExpInfo = async () => {
      try {
        setIsLoading(true);
        const data = await getUserExpInfo();
        setUserRank(data.userRank);
      } catch (error) {
        console.error('Failed to fetch user exp info:', error);
        setUserRank(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileImage();
    fetchUserExpInfo();

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

    // 프로필 세팅
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
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
      <Grid container spacing={3}>
        {/* 프로필 정보 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar
                  alt="profile image"
                  src={`/main_profile/${profile.profileImageURL}`}
                  sx={{ width: 100, height: 100 }}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="h6">{profile.nickname}</Typography>
                <Typography variant="body2" color="textSecondary">{profile.email}</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center">
                  <FaMapMarkerAlt />
                  <Typography variant="body2" sx={{ ml: 1 }}>{profile.locationName}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center">
                  <FaUserAlt />
                  <Typography variant="body2" sx={{ ml: 1 }}>{profile.gender}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center">
                  <FaUsers />
                  <Typography variant="body2" sx={{ ml: 1 }}>{profile.ageRange}</Typography>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Link href="/user/profile/update" passHref>
                <Button variant="contained" fullWidth>프로필 수정</Button>
              </Link>
            </Box>
          </Paper>
        </Grid>

        {/* 티어, 경험치,  순위 */}
        <Grid item xs={12} md={6}>
          <Rank userRank={userRank} isLoading={isLoading} />
          <Box sx={{ mt: 2}}>
            <Tier exp={parseInt(profile.exp)} isLoading={false} />
          </Box>
        </Grid>

        {/* 최근 푼 문제 */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>최근 푼 문제</Typography>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: 'green', mr: 2 }}>GO</Avatar>
              <Box flexGrow={1}>
                <Typography variant="body1">경상도 사투리 - 입상</Typography>
                <LinearProgress variant="determinate" value={75.93} />
                <Typography variant="body2" sx={{ mt: 1 }}>평균 정확도: 75.93%</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* 주간 스트릭 */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>주간 스트릭</Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2">24년 8월 1주차</Typography>
              <Typography variant="body2">4일 연속 학습 중!</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={2}>
              {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                <Box key={day} textAlign="center">
                  <Typography variant="body2">{day}</Typography>
                  <FaFire color={index < 4 ? "orange" : "gray"} />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* 연간 스트릭 */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>연간 스트릭</Typography>
            {/* 여기에 연간 스트릭 차트를 구현해야 합니다. 
                복잡한 차트이므로 별도의 라이브러리(예: recharts)를 사용하는 것이 좋습니다. */}
            <Box height={200} bgcolor="lightgray">
              <Typography variant="body2" align="center">
                연간 스트릭 차트 (구현 필요)
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
