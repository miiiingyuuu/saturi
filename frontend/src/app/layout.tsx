"use client"

import "@/styles/globals.css";
// import type { Metadata } from "next"
import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import Button from "@mui/material/Button";
import { useRouter, usePathname } from "next/navigation";
import Divider from "@mui/material/Divider";
import { authToken } from "@/utils/authutils";
import { styled } from "@mui/material/styles"
import { useState, useEffect } from "react";

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
  const router = useRouter()
  const pathname = usePathname(); // 현재 경로 가져오기
  const [isLoggedIn, setIsLoggedIn ] = useState(false); // 로그인 상태 변수
  const hideHeader = pathname.startsWith('/admin')

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    setIsLoggedIn(!!accessToken);
    if (accessToken) {
      authToken(router)
    }
  }, [router]);


  return (
    <html lang="ko" className="light">
    <body className="inter-class-name">
    {!hideHeader && (
      <header>
        <div className="header">
          <Link href="/">
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
            <Link href="/profile">
              <Image src="/profile-pic.png" width={50} height={50} alt="Profile Picture" style={{ borderRadius: '50%' }} />
            </Link>
          )}
        </div>
        <Divider />
      </header>
    )}
    {children}
    <footer className="footer">
      <div className="footer-content">
        <Image src="/SSLogo.png" width={127.5} height={85} alt="SSLogo" />
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