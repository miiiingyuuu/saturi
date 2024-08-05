// components/profile/UserTierRank.tsx

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Paper, Box, Typography, CircularProgress } from "@mui/material";
import api from '@/lib/axios';
import { FaCrown } from 'react-icons/fa';

const tierImages = {
  stone: '/tier/stone.png',
  bronze: '/tier/bronze.png',
  silver: '/tier/silver.png',
  gold: '/tier/gold.png',
  emerald: '/tier/emerald.png',
  platinum: '/tier/platinum.png',
  diamond: '/tier/diamond.png'
};

type TierKey = keyof typeof tierImages;

const getTierFromExp = (exp: number): TierKey => {
  if (exp === 0) return 'stone';
  if (exp < 100) return 'bronze';
  if (exp < 200) return 'silver';
  if (exp < 300) return 'gold';
  if (exp < 400) return 'emerald';
  if (exp < 500) return 'platinum';
  return 'diamond';
};

const formatTierName = (tier: TierKey): string => {
  return tier.charAt(0).toUpperCase() + tier.slice(1) + ' Tier';
};

interface UserExpInfo {
  currentExp: number;
  userRank: number;
}

const UserTierRank: React.FC = () => {
  const [userExpInfo, setUserExpInfo] = useState<UserExpInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchUserExpInfo = async () => {
      try {
        setIsLoading(true);
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found');
        }

        const response = await api.get<{ userExpInfo: UserExpInfo }>('/user/auth/dashboard');
        setUserExpInfo(response.data.userExpInfo);

      } catch (error) {
        console.error('Failed to fetch user exp info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserExpInfo();
  }, []);

  useEffect(() => {
    setImageLoaded(false);
  }, [userExpInfo?.currentExp]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!userExpInfo) {
    return <Typography>Failed to load user information.</Typography>;
  }

  const tierKey = getTierFromExp(userExpInfo.currentExp);
  const imageSrc = tierImages[tierKey];
  const tierName = formatTierName(tierKey);

  return (
    <Paper sx={{ 
      p: 3, 
      bgcolor: '#f0f0f0', 
      borderRadius: '16px',
      position: 'relative',
      height: '80%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Box sx={{ top: 16, left: 16, display: 'flex', alignItems: 'center', marginTop: 3}}>
        <FaCrown style={{ color: 'gold', marginRight: 8 }} />
        <Typography variant="h6" >전체 {userExpInfo.userRank}위</Typography>
      </Box>
      <Box sx={{ marginTop: 1}}>
          {!imageLoaded && (
            <CircularProgress 
              size={60}
              sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)' 
              }} 
            />
          )}
          <Image
            src={imageSrc}
            alt={`${tierKey} Tier`}
            width={120}
            height={120}
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
          />
      </Box>
      <Typography variant="h5" color="text.primary" sx={{ mt: 1 }}>
        {tierName}
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
        {`${userExpInfo.currentExp} EXP`}
      </Typography>
    </Paper>
  );
};

export default UserTierRank;