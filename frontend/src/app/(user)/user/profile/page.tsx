"use client";

import React, { useEffect, useState } from "react";
import { 
  Box,
  Grid,
  Paper,
  Typography
} from "@mui/material";
import RecentProblem from "@/components/profile/recentProblem";
import WeeklyStreak from "@/components/profile/weeklyStreak";
import YearlyStreak from "@/components/profile/yearlyStreak";
import ProfileInfo from "@/components/profile/profileInfo";
import UserTierRank from "@/components/profile/userTierRank";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import api from "@/lib/axios";
import Chatbot from "@/components/chatbot/chatbot";


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
    weekAndMonth: number[];
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
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found');
        }

        const response = await api.get('/user/auth/dashboard', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setDashboardData(response.data);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3} sx={{ maxWidth: '75%', mx: 'auto' }}>
        {/* My Profile 섹션 */}
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            <AccountBoxIcon fontSize="medium" /> My Profile
          </Typography>
          <Grid container spacing={3}>
            {/* 프로필 정보 */}
            <Grid item xs={12} md={6}>
              <ProfileInfo />
            </Grid>
            
            {/* 티어, 경험치, 순위 */}
            <Grid item xs={12} md={6}>
              <UserTierRank/>
            </Grid>
          </Grid>
        </Grid>
  
        {/* Dashboard 섹션 */}
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ mb: 2, mt: 4 }}>
            <SpaceDashboardIcon fontSize="medium"/> Dashboard
          </Typography>
          <Grid container spacing={3}>
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
                <YearlyStreak 
                  data={dashboardData?.streakInfo || null}
                  totalLessonInfo={dashboardData?.totalLessonInfo || { totalLessonGroup: 0, totalLesson: 0}} 
                  isLoading={isLoading} 
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box>
        <Chatbot />
      </Box>
    </Box>
  );
}