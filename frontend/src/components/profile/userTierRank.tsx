// components/profile/UserTierRank.tsx

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Paper, Box, Typography, CircularProgress } from "@mui/material";
import api from '@/lib/axios';
import { FaBox } from 'react-icons/fa';

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
    <Paper sx={{ p: 4, bgcolor: 'primary.main', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5">
          {`전체 순위: ${userExpInfo.userRank}`}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" sx={{ mt: 4 }}>
        <Box sx={{ position: 'relative', mr: 6, width: 100, height: 100 }}>
          {!imageLoaded && (
            <CircularProgress 
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
            width={100}
            height={100}
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
          />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ whiteSpace: "nowrap", overflow: 'visible', mb: 0.5 }}>
            {tierName}
          </Typography>
          <Typography variant="h6">
            {`${userExpInfo.currentExp} EXP`}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserTierRank;