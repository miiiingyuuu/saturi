"use client";

import React, { useEffect, useState } from "react";
import { 
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import Image from "next/image";
import RecentProblem from "@/components/profile/recentProblem";
import WeeklyStreak from "@/components/profile/weeklyStreak";
import YearlyStreak from "@/components/profile/yearlyStreak";
import ProfileInfo from "@/components/profile/profileInfo";
import UserTierRank from "@/components/profile/userTierRank";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import { FaTrophy } from "react-icons/fa";
import Chatbot from "@/components/chatbot/chatbot";
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

// 티어 정보
const tierRanges = [
  { tier: 'Stone', min: 0, max: 0, image: '/tier/stone.png' },
  { tier: 'Bronze', min: 1, max: 99, image: '/tier/bronze.png' },
  { tier: 'Silver', min: 100, max: 499, image: '/tier/silver.png' },
  { tier: 'Gold', min: 500, max: 1499, image: '/tier/gold.png' },
  { tier: 'Platinum', min: 1500, max: 2999, image: '/tier/platinum.png' },
  { tier: 'Sapphire', min: 3000, max: 4999, image: '/tier/sapphire.png' },
  { tier: 'Diamond', min: 5000, max: Infinity, image: '/tier/diamond.png' },
];

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <AccountBoxIcon style={{ marginRight: '8px' }} /> My Profile
        </Typography>
        <IconButton onClick={handleClick} color="primary">
          <FaTrophy style={{ marginRight: '8px' }} /> Tier ?
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: 300,
              width: '300px',
            },
          }}
        >
          {tierRanges.map((tier, index) => (
            <MenuItem key={index} onClick={handleClose} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <Image src={tier.image} alt={tier.tier} width={40} height={40} />
             <Box>
               <Typography variant="subtitle1">{tier.tier}</Typography>
               <Typography variant="body2">
                 {tier.max === Infinity 
                   ? `${tier.min} EXP 이상` 
                   : `${tier.min} ~ ${tier.max} EXP`}
               </Typography>
             </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Grid container spacing={3} sx={{ height: '100%' }}>
        {/* 프로필 정보 */}
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <Box sx={{ width: '100%', height: '100%' }}>
            <ProfileInfo />
          </Box>
        </Grid>
            
            {/* 티어, 경험치, 순위 */}
            <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <UserTierRank />
              </Box>
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