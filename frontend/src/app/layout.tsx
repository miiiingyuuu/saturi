"use client"

import "@/styles/globals.css";
import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import Button from "@mui/material/Button";
import { usePathname, useRouter } from "next/navigation";
import Divider from "@mui/material/Divider";
import { authToken } from "@/utils/authutils";
import { styled } from "@mui/material/styles";
import { Popover, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

// 버튼 색
const LoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#99DE83',
  '&:hover': {
    backgroundColor: '#7AB367',
  },
}));

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 가져오기
  const [isLoggedIn, setIsLoggedIn ] = useState(false); // 로그인 상태 변수

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    const refreshToken = sessionStorage.getItem("refreshToken");
    setIsLoggedIn(!!accessToken);
  }, []);

  // 특정 경로에서 header를 숨기기
  const hideHeader = pathname.startsWith("/game/in-game");

  if (sessionStorage.getItem("accessToken")) {
    authToken()
  }

  // 프로필 PopOver 관련 필요 변수들
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null)
  };

  const open = Boolean(anchorEl);

  return (
    <html lang="ko" className="light">
      <body className={inter.className}>
          {!hideHeader && (
          <header>
            <div className="header">
              <Link href={isLoggedIn ? "/main" : "/start"}>
                <Image src="/SSLogo.png" width={127.5} height={85} alt="SSLogo" />
              </Link>
              {!isLoggedIn ? (
                <Link href="/login">
                  <LoginButton
                    variant="contained"
                    sx={{
                      fontWeight: 'bold',
                      height: '50px',
                      mt: 2,
                    }}
                  >
                    로그인
                  </LoginButton>
                </Link>
              ) : (
                <div>
                  <Image
                    src="https://localhost:8000/bird/agent.png" 
                    width={50} 
                    height={50} 
                    alt="Profile Picture" 
                    style={{ borderRadius: '50%' }} 
                    onClick={handleProfileClick}
                  />
                  <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <Typography sx={{ p: 2 }}>My profile</Typography>
                  </Popover>
                </div> 
              )}
            </div>
            <Divider/>
          </header>
          )}
            {children}
          <footer className="footer">
            <div className="footer-content">
              <Image src="/SSLogo.png" width={127.5} height={85} alt="SSLogo"/>
              <div className="footer-links">
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
              </div>
              <p>&copy; 2024 My Next.js App. All rights reserved.</p>
            </div>
          </footer>
      </body>
    </html>
  );
}
