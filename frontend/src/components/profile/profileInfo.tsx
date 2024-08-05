import React, { useEffect, useState } from 'react';
import { Avatar, Box, Typography, Grid, Paper, Button } from '@mui/material';
import { FaMapMarkerAlt, FaUserAlt, FaUsers } from "react-icons/fa";
import Link from "next/link";
import api from "@/lib/axios";

interface ProfileData {
  nickname: string;
  email: string;
  locationId: number;
  gender: string;
  ageRange: string;
  birdId: number;
}

const ProfileInfo: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found');
        }

        const response = await api.get<ProfileData>('/user/auth/profile', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (isLoading) {
    return <Typography>Loading profile...</Typography>;
  }

  if (!profile) {
    return <Typography>Failed to load profile information.</Typography>;
  }

  const getFormattedLocationId = (locationId: number): string => {
    const locations = {
      1: '정보 입력 안함',
      2: '경상도',
      3: '경기도',
      4: '강원도',
      5: '충청도',
      6: '전라도',
      7: '제주도'
    };
    return locations[locationId as keyof typeof locations] || '정보 입력 안함';
  };
  
  const getFormattedGender = (gender: string): string => {
    const genders = {
      'DEFAULT': '정보 입력 안함',
      'FEMALE': '여자',
      'MALE': '남자',
    };
    return genders[gender as keyof typeof genders] || '정보 입력 안함';
  };
  
  const getFormattedAgeRange = (ageRange: string): string => {
    const ageRanges = {
      'DEFAULT': '정보 입력 안함',
      'CHILD': '영유아',
      'TEENAGER': '10대',
      'TWENTEEN': '20대',
      'THIRTEEN': '30대',
      'FOURTEEN': '40대',
      'FIFTEEN': '50대',
      'SIXTEEN': '60대',
      'SEVENTEEN': '70대',
      'EIGHTEEN': '80대',
      'NINETEEN': '90대',
    };
    return ageRanges[ageRange as keyof typeof ageRanges] || '정보 입력 안함';
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar
            alt="profile image"
            src={`/main_profile/${profile.birdId}.png`}
            sx={{ width: 100, height: 100 }}
          />
        </Grid>
        <Grid item xs>
          <Typography variant="h6">{profile.nickname}</Typography>
          <Typography variant="body2" color="textSecondary">{profile.email}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={4}>
          <Box display="flex" alignItems="center">
            <FaMapMarkerAlt />
            <Typography variant="body2" sx={{ ml: 1 }}>사투리 : {getFormattedLocationId(profile.locationId)}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box display="flex" alignItems="center">
            <FaUserAlt />
            <Typography variant="body2" sx={{ ml: 1 }}>성별 : {getFormattedGender(profile.gender)}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box display="flex" alignItems="center">
            <FaUsers />
            <Typography variant="body2" sx={{ ml: 1 }}>연령대 : {getFormattedAgeRange(profile.ageRange)}</Typography>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Link href="/user/profile/update" passHref>
          <Button variant="contained" fullWidth>프로필 수정</Button>
        </Link>
      </Box>
    </Paper>
  );
};

export default ProfileInfo;