"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Button, Divider, Menu, MenuItem, Box, Avatar, IconButton, 
  Tooltip, ListItemIcon, Typography, CircularProgress 
} from "@mui/material";
import { Logout } from '@mui/icons-material';
import { authToken } from "@/utils/authutils";
import useLogout from "@/hooks/useLogout";
import UserTierRank from "@/components/profile/userTierRank";
import api from "@/lib/axios";
import AccountBoxIcon from '@mui/icons-material/AccountBox';


export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthChecked, setIsAuthChecked] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickName] = useState<string | null>(null);
  const logout = useLogout();

  const isStartPage = pathname === '/start' || pathname === '/';

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  function handleLogoClick() {
    const accessToken = sessionStorage.getItem("accessToken");
    const targetPath = accessToken ? '/main' : '/start';
    window.location.href = targetPath; // 또 오류 나면... 어쩔 수 없이 쳐내야지 다른 방법 찾기
  }

  const updateUserInfo = async () => {
    setProfileLoading(true);
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const response = await api.get('/user/auth/profile')
      
      const userData = response.data;
      setProfileImage(userData.birdId);
      setNickName(userData.nickname);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      // setProfileImage("/default-profile.png");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    async function checkAuth() {
      if (sessionStorage.getItem("accessToken")) {
        await updateUserInfo();
        setIsLoggedIn(true);

        if (pathname !== '/start') {
          authToken();
        }
      } else {
        setIsLoggedIn(false);
        if (pathname&&!['/start', '/login', '/register', '/findpassword', '/findpassword/tmppassword'].includes(pathname)) {
          router.push('/start');
        }
      }
      setIsAuthChecked(false);
    };

    checkAuth();
  }, [pathname, router]);

  return (
    <header className="w-full">
      <Box 
        className="flex items-center justify-between px-8" 
        sx={{
          minHeight:"50px",
          height:"10vh",
          backgroundColor: isStartPage ? 'transparent' : 'rgb(243, 244, 246)', //Start 페이지일 때 투명 배경
        }}>
        <Box 
          component="img"   
          className="cursor-pointer"
          src = "/SSLogo.png"
          alt = "SSLogo"
          onClick={handleLogoClick}
          sx={{
            width:"100px",
            mt: 3,
        }}/>          
        <div className="flex items-center">
          {isAuthChecked ? (
            <CircularProgress size={24} />
          ) : !isLoggedIn ? (
            <Link href="/login">
              <Button 
                variant="contained"
                className="font-bold h-10"
                sx={{
                  color: 'white',
                  borderColor: 'white' 
                }}
                >
                로그인
              </Button>
            </Link>
          ) : (
            <Box>
              <Tooltip title="View Profile">
                <IconButton
                  onClick={handleOpenMenu}
                  size="medium"
                  className="ml-2"
                  aria-controls={anchorEl ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={anchorEl ? 'true' : undefined}
                >
                  {profileLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Avatar
                      sizes="large" 
                      src={profileImage ? `/mini_profile/${profileImage}.png` : "이미지가 없습니다."} 
                    />
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                onClick={handleCloseMenu}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>{nickname}님, 안녕하세요!</Typography>
                  <Box
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: 2,
                    width: '100%',
                    mt: 2
                  }}>
                    <UserTierRank layout="horizontal"/>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ mt: 1 }}>
                  <MenuItem
                    onClick={() => {
                    router.push("/user/profile")
                  }}>
                    <ListItemIcon sx={{ mr: 1 }}>
                      <AccountBoxIcon fontSize="large" />
                    </ListItemIcon>
                    My Profile
                  </MenuItem>
                  
                  <MenuItem
                    onClick={() => {
                    logout()
                    }}>
                    <ListItemIcon sx={{ mr: 1 }}>
                      <Logout fontSize="large" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Box>
              </Menu>
            </Box>
          )}
        </div>
      </Box>
    </header>
  );
}