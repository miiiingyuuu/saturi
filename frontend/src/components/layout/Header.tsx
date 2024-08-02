/* eslint-disable no-nested-ternary */

"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';
import { styled } from "@mui/material/styles";
import { useState, useEffect, MouseEvent } from "react";
import { Menu, MenuItem, Box, Avatar, IconButton, Tooltip, ListItemIcon, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { getProfile, getAllCookies  } from "@/utils/profile";
import useLogout from "@/hooks/useLogout";

// 버튼 색
const LoginButton = styled(Button)(() => ({
  backgroundColor: '#99DE83',
  '&:hover': {
    backgroundColor: '#7AB367',
  },
}));

export default function Header() {
  const router = useRouter();
  const logout = useLogout()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // 로그인 이후에는 start 페이지로 가지 못하게 막기
  const handleLogoClick = () => {
    const accessToken = localStorage.getItem("accessToken");
    const targetPath = accessToken ? '/main' : '/start';
  
    if (window.location.pathname !== targetPath) {
      router.push(targetPath);
    }
  };
  

  // DB의 사용자 정보를 백(쿠키)에 요청
  const updateUserInfo = () => {
    const accessToken = sessionStorage.getItem("accessToken");
    // 이미지 가져오기
    if (accessToken) {
      setIsLoggedIn(true);
      getProfile()
        .then(imageUrl => {
          setProfileImage(imageUrl);
        })
        .catch(() => {
          setProfileImage("/default-profile.png");
        });

        // 쿠키에 있는 모든 정보 가져오기
        const cookies = getAllCookies();
        setNickName(cookies.nickname || "");
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    updateUserInfo();
  }, []);

  return (
    <header>
      <div className="header" style={{ display: 'flex', alignItems: 'center', marginLeft: '30px' }}>
        <Image
          src="/SSLogo.png"
          alt="SSLogo"
          width={127.5}
          height={85}
          style={{ cursor: 'pointer' }}
          onClick={handleLogoClick}
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {loading ? (
            <Avatar sx={{ width: 60, height: 60, mr: 6 }} />
          ) : !isLoggedIn ? (
            <Link href="/login">
              <LoginButton
                variant="contained"
                sx={{
                  fontWeight: 'bold',
                  height: '40px',
                  marginRight: '60px',
                }}
              >
                로그인
              </LoginButton>
            </Link>
          ) : (   
            // 프로필 클릭 시 팝업되서 나오는 메뉴들
            <Box>
              <Tooltip title="View Profile">
                <IconButton
                  onClick={handleOpenMenu}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={anchorEl ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={anchorEl ? 'true' : undefined}
                >
                  <Avatar sx={{ width: 85, height: 85, mr: 4 }} src={profileImage || "/default-profile.png"} />
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
                    maxWidth: 300, // 메뉴의 최대 너비 설정
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&::before': {
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
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
              >
                <Typography sx={{ ml: 2, mr: 2, mb: 1}}>
                  {nickname}님 반갑습니다!
                </Typography>

                <Divider />

                <MenuItem component={Link} href="/user/profile">
                <Avatar /> My Profile
                </MenuItem>

                <MenuItem component={Link} href="/user/profile">
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Dashboard
                </MenuItem>

                <MenuItem onClick={() => {
                  logout()
                  router.push("/start")
                  }}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </div>
      </div>
      <Divider />
    </header>
  );
}
