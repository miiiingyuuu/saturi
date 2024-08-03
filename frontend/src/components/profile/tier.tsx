import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Paper, Box, Typography, CircularProgress } from "@mui/material";

// 티어 이미지 매핑
const tierImages = {
  bronze: '/tier/bronze.png',
  silver: '/tier/silver.png',
  gold: '/tier/gold.png',
  emerald: '/tier/emerald.png',
  platinum: '/tier/platinum.png',
  diamond: '/tier/diamond.png'
};

// exp에 따른 티어 결정 함수
const getTierFromExp = (exp: number) => {
  if (exp < 100) return 'bronze';
  if (exp < 200) return 'silver';
  if (exp < 300) return 'gold';
  if (exp < 400) return 'emerald';
  if (exp < 500) return 'platinum';
  return 'diamond';
};

interface TierProps {
  exp: number | null;
  isLoading: boolean;
}

const Tier: React.FC<TierProps> = ({ exp, isLoading }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const tier = exp !== null && !isNaN(exp) ? getTierFromExp(exp) : 'bronze';
  const imageSrc = tierImages[tier];

  useEffect(() => {
    setImageLoaded(false);
  }, [imageSrc]);

  return (
    <Paper elevation={3} sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box display="flex" alignItems="center">
        {/* 티어 이미지 */}
        <Box sx={{ position: 'relative', mr: 6, width: 100, height: 100 }}>
          {(!imageLoaded || isLoading) && (
            <CircularProgress 
              sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)' 
              }} 
            />
          )}
          {!isLoading && (
            <Image
              src={imageSrc}
              alt={`${tier} Tier`}
              width={100}
              height={100}
              onLoad={() => setImageLoaded(true)}
              style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
            />
          )}
        </Box>

        {/* 티어 이름과 경험치 */}
        <Box>
          <Typography variant="h5" sx={{ mb: 0.5 }}>
            {isLoading ? "Loading 중..." : `${tier.charAt(0).toUpperCase() + tier.slice(1)} Tier`}
          </Typography>
          <Typography variant="h6">
            {isLoading ? "Loading 중..." : `EXP: ${exp} %`}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Tier;
