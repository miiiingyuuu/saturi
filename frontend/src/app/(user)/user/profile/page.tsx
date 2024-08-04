"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Button, 
  Typography, 
  Avatar,
  Box,
  Divider,
  Grid,
  Paper
} from "@mui/material";
import { FaMapMarkerAlt, FaUserAlt, FaUsers } from "react-icons/fa";
import { getProfile, getAllCookies } from "@/utils/profile";
import { getCookie } from "cookies-next";
import Tier from '@/components/profile/tier'
import Rank from "@/components/profile/rank";
import { getUserRank } from "@/utils/profile";
import sampleData from '@/mocks/dashboard_sample.json';
import RecentProblem from "@/components/profile/recentProblem";
import WeeklyStreak from "@/components/profile/weeklyStreak";
import YearlyStreak from "@/components/profile/yearlyStreak";
import api from "@/lib/axios";


// Dashboard type 선언
interface DashboardData {
  userExpInfo: {
    currentExp: number;
    userRank: number;
  };
  recentLessonGroup: {
    lessonGroupId: number;
    lessonGroupName: string;
    locationId: number;
    categoryId: number;
    avgSimilarity: number | null;
    avgAccuracy: number | null;
    startDt: string;
    endDt: string | null;
    isCompleted: boolean;
  };
  continuousLearnDay: {
    learnDays: number;
    daysOfTheWeek: number[];
  };
  streakInfo: Array<{
    streakDate: {
      year: number;
      month: number;
      day: number;
    };
    solvedNum: number;
  }>;
  totalLessonInfo: {
    totalLessonGroup: number;
    totalLesson: number;
  };
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [profile, setProfile] = useState({
    profileImageURL: '',
    exp: '',
    nickname: '',
    email: '',
    ageRange: '',
    gender: '',
    locationId: '',
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
    const fetchUserRank = async () => {
      try {
        setIsLoading(true);
        const rank = await getUserRank();
        setUserRank(rank);
      } catch (error) {
        console.error('Failed to fetch user exp info:', error);
        setUserRank(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileImage();
    fetchUserRank();

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

    const getFormattedLocationId = (locationId: string): string => {
      switch (locationId) {
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
    };

    // 프로필 세팅
    setProfile(prevProfile => ({
      ...prevProfile,
      exp: (cookies.exp as string) || '없음',
      nickname: (cookies.nickname as string) || '없음',
      email: (cookies.email as string) || '없음',
      ageRange: getFormattedAgeRange(cookies.ageRange as string),
      gender: getFormattedGender(cookies.gender as string),
      locationId: getFormattedLocationId(cookies.locationId as string),
    }));

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found');
        }

        // 실제 API 호출 (현재는 주석 처리)
        // const response = await api.get('/user/auth/dashboard', {
        //   headers: { Authorization: `Bearer ${accessToken}` }
        // });
        // setDashboardData(response.data);

        // 샘플 데이터 사용
        setDashboardData(sampleData as DashboardData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
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
                  <Typography variant="body2" sx={{ ml: 1 }}>{profile.locationId}</Typography>
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
          <Box sx={{ mt: 2}}>
            <Rank userRank={userRank} isLoading={isLoading} />
          </Box>
          <Box sx={{ mt: 2}}>
            <Tier exp={parseInt(profile.exp)} isLoading={false} />
          </Box>
        </Grid>

        {/* 최근 푼 문제 */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <RecentProblem data={dashboardData?.recentLessonGroup || null} isLoading={isLoading} />
          </Paper>
        </Grid>

        {/* 주간 스트릭 */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <WeeklyStreak data={dashboardData?.continuousLearnDay || null} isLoading={isLoading} />
          </Paper>
        </Grid>

        {/* 연간 스트릭 */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <YearlyStreak data={dashboardData?.streakInfo || null} isLoading={isLoading} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}