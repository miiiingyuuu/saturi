"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';
import { useState, useEffect, MouseEvent } from "react";
import { Menu, MenuItem, Box, Avatar, IconButton, Tooltip, ListItemIcon, Typography, CircularProgress } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import Person from '@mui/icons-material/Person';
import Logout from '@mui/icons-material/Logout';
import { getProfile, getAllCookies  } from "@/utils/profile";
import { authToken } from "@/utils/authutils";
import useLogout from "@/hooks/useLogout";
import Tier from "@/components/profile/tier";
import { Settings } from "@mui/icons-material";


export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthChecked, setIsAuthChecked] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickName] = useState<string | null>(null);
  const [profileExp, setProfileExp] = useState<number | null>(null);
  const logout = useLogout();

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogoClick = () => {
    const accessToken = sessionStorage.getItem("accessToken");
    const targetPath = accessToken ? '/main' : '/start';
    if (pathname !== targetPath) {
      router.push(targetPath);
    }
  };

  const updateUserInfo = async () => {
    setProfileLoading(true);
    try {
      const imageUrl = await getProfile();
      setProfileImage(imageUrl);
      const cookies = getAllCookies();
      setNickName(cookies.nickname || "");
      setProfileExp(cookies.exp ? parseInt(cookies.exp, 10) : null); // Set profile experience
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      setProfileImage("/default-profile.png");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = sessionStorage.getItem("accessToken");
      if (accessToken) {
        setIsLoggedIn(true);
        await updateUserInfo();
        if (pathname !== '/start') {
          authToken(router);
        }
      } else {
        setIsLoggedIn(false);
        if (pathname !== '/start' && pathname !== '/login') {
          router.push('/start');
        }
      }
      setIsAuthChecked(false);
    };

    checkAuth();
  }, [pathname, router]);

  return (
    <header className="w-full">
      <div className="flex items-center justify-between px-8 py-4">
        <Image
          src="/SSLogo.png"
          alt="SSLogo"
          width={127.5}
          height={85}
          className="cursor-pointer"
          onClick={handleLogoClick}
        />
        <div className="flex items-center">
          {isAuthChecked ? (
            <CircularProgress size={24} />
          ) : !isLoggedIn ? (
            <Link href="/login">
              <Button variant="contained" className="font-bold h-10">
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
                      src={profileImage ? `/mini_profile/${profileImage}` : "/default-profile.png"} 
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
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: 2,
                    width: '100%',
                    mt: 2
                  }}>
                    <Box sx={{ width: "auto"}}>
                      <Tier exp={profileExp || 0} isLoading={profileLoading} />
                    </Box>
                  </Box>
                </Box>
                <Divider />
                <MenuItem
                  onClick={() => {
                  router.push("/user/profile")
                }}>
                  {/* <ListItemIcon> */}
                    <Person fontSize="large" />
                  {/* </ListItemIcon> */}
                  내 프로필
                </MenuItem>

                <MenuItem component={Link} href="/user/profile">
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Dashboard
                </MenuItem>

                <MenuItem
                  onClick={() => {
                  logout()
                    .then(() => router.push("/start"))
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
    </header>
  );
}