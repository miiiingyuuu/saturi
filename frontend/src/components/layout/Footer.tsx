import React from 'react';
import Image from "next/image";
import { Box, Typography, Button, Grid } from "@mui/material";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-gray-100 py-6">
      <Box className="container mx-auto px-4">
        <Grid container alignItems="center" justifyContent="space-between">
          {/* 왼쪽: 저작권 정보 */}
          <Grid item xs={12} md={3}>
            <Box className="flex flex-col justify-center h-full">
              <Typography variant="body2" className="text-gray-600">
                사투리가 서툴러유
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                © 2024 All rights reserved.
              </Typography>
            </Box>
          </Grid>

          {/* 중앙: 로고와 버튼들 */}
          <Grid item xs={12} md={6}>
            <Box className="flex flex-col items-center">
              <Image
                src="/SSLogo.png" 
                width={100} 
                height={66.67} 
                alt="SSLogo" 
              />
              <Box className="flex gap-2">
                <Link href="/" passHref>
                  <Button variant="text" color="primary" size="small">Home</Button>
                </Link>
                <Link href="/register" passHref>
                  <Button variant="text" color="primary" size="small">SignUP</Button>
                </Link>
                <Link href="/login" passHref>
                  <Button variant="text" color="primary" size="small">LogIn</Button>
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* 오른쪽: 팀 정보 */}
          <Grid item xs={12} md={3}>
            <Box className="flex flex-col justify-center h-full items-end">
              <Typography variant="body2" className="text-gray-600 text-right mb-1">
                Team 사조참치에펄추가
              </Typography>
              <Typography variant="body2" className="text-gray-600 text-right">
                BackEnd 이진주 하재훈 허동원
              </Typography>
              <Typography variant="body2" className="text-gray-600 text-right">
                FrontEnd 박동현 박민규 허태훈
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </footer>
  );
}